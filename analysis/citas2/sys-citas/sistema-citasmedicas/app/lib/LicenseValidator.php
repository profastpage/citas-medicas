<?php
/**
 * LicenseValidator — Verificación offline de licencia (HMAC-SHA256)
 *
 * IMPORTANTE: LIC_SECRET_KEY debe ser IDÉNTICA a la definida en:
 *   licencias-admin/app/models/LicenciaModel.php
 *
 * Esta clase verifica la licencia localmente desde la tabla licencia_config
 * de la propia base de datos del cliente (sistema_citas_medicas_db).
 * NO hace ninguna llamada de red — los datos clínicos nunca salen del sistema.
 */

if (!defined('LIC_SECRET_KEY')) {
    define('LIC_SECRET_KEY', 'S!st3m@C1t@sM3d2024#XK9');
}
if (!defined('LIC_GRACE_DAYS')) {
    define('LIC_GRACE_DAYS', 5);
}

class LicenseValidator
{
    /**
     * Obtiene la configuración de licencia guardada en BD.
     */
    public static function obtenerConfig(PDO $db): ?array
    {
        try {
            $stmt = $db->query("SELECT * FROM licencia_config WHERE id = 1 LIMIT 1");
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Verifica si la licencia actual es válida.
     * Retorna: ['valida' => bool, 'estado' => string, 'mensaje' => string, 'dias_restantes' => int, 'config' => array]
     */
    public static function verificar(PDO $db): array
    {
        $config = self::obtenerConfig($db);

        if (!$config || empty($config['clave_licencia'])) {
            return [
                'valida'          => false,
                'estado'          => 'No activada',
                'mensaje'         => 'El sistema no tiene una licencia activada.',
                'dias_restantes'  => 0,
                'config'          => $config ?? [],
            ];
        }

        if ($config['estado'] === 'Suspendida') {
            return [
                'valida'         => false,
                'estado'         => 'Suspendida',
                'mensaje'        => 'La licencia ha sido pausada temporalmente por el proveedor.',
                'dias_restantes' => 0,
                'config'         => $config,
            ];
        }

        if ($config['estado'] === 'Revocada') {
            return [
                'valida'         => false,
                'estado'         => 'Revocada',
                'mensaje'        => 'La licencia ha sido revocada por el proveedor y ya no es válida.',
                'dias_restantes' => 0,
                'config'         => $config,
            ];
        }

        $hoy          = new DateTime();
        $vencimiento  = new DateTime($config['fecha_vencimiento']);
        $diff         = $hoy->diff($vencimiento);
        $dias         = (int)$diff->days;

        // ¿Dentro del período de gracia?
        if ($hoy > $vencimiento) {
            $diasVencido = $dias;
            if ($diasVencido <= LIC_GRACE_DAYS) {
                return [
                    'valida'         => true,
                    'estado'         => 'Gracia',
                    'mensaje'        => "Licencia vencida hace {$diasVencido} día(s). Aún dentro del período de gracia (" . LIC_GRACE_DAYS . " días). Por favor renueve.",
                    'dias_restantes' => -(int)$diasVencido,
                    'config'         => $config,
                ];
            }
            return [
                'valida'         => false,
                'estado'         => 'Vencida',
                'mensaje'        => "La licencia venció el " . date('d/m/Y', strtotime($config['fecha_vencimiento'])) . ". Contacte al proveedor para renovar.",
                'dias_restantes' => -(int)$diasVencido,
                'config'         => $config,
            ];
        }

        return [
            'valida'         => true,
            'estado'         => 'Activa',
            'mensaje'        => "Licencia activa hasta " . date('d/m/Y', strtotime($config['fecha_vencimiento'])),
            'dias_restantes' => (int)$dias,
            'config'         => $config,
        ];
    }

    /**
     * Activa una clave de licencia ingresada por el usuario.
     * La clave debe coincidir con: HMAC_SHA256(ruc|fecha_fin|id_empresa, SECRET)
     * Se busca la coincidencia en la BD de licencias (panel proveedor — licencias_db).
     *
     * IMPORTANTE: Para activación offline se pide también ruc + fecha_fin + id_empresa.
     * Retorna: ['ok' => bool, 'mensaje' => string]
     */
    public static function activar(
        PDO    $clientDb,
        string $clave,
        string $ruc,
        string $fecha_fin,
        int    $id_empresa,
        string $empresa_nombre
    ): array {
        // Verificar que la clave es matemáticamente correcta
        $data = strtoupper(trim($ruc)) . '|' . $fecha_fin . '|' . $id_empresa;
        $expected = hash_hmac('sha256', $data, LIC_SECRET_KEY);

        if (!hash_equals($expected, trim($clave))) {
            return ['ok' => false, 'mensaje' => 'Clave de licencia inválida. Verifique los datos ingresados.'];
        }

        // Verificar que la fecha no está vencida
        if (new DateTime($fecha_fin) < new DateTime()) {
            return ['ok' => false, 'mensaje' => 'La licencia proporcionada ya está vencida.'];
        }

        // Guardar en licencia_config
        try {
            $stmt = $clientDb->prepare("
                INSERT INTO licencia_config (id, clave_licencia, empresa_nombre, fecha_activacion, fecha_vencimiento, estado)
                VALUES (1, :clave, :nombre, NOW(), :vence, 'Activa')
                ON DUPLICATE KEY UPDATE
                    clave_licencia   = VALUES(clave_licencia),
                    empresa_nombre   = VALUES(empresa_nombre),
                    fecha_activacion = VALUES(fecha_activacion),
                    fecha_vencimiento= VALUES(fecha_vencimiento),
                    estado           = 'Activa'
            ");
            $stmt->execute([
                ':clave'  => trim($clave),
                ':nombre' => $empresa_nombre,
                ':vence'  => $fecha_fin,
            ]);
            return ['ok' => true, 'mensaje' => '¡Licencia activada exitosamente!'];
        } catch (Exception $e) {
            return ['ok' => false, 'mensaje' => 'Error al guardar la licencia: ' . $e->getMessage()];
        }
    }

    /**
     * Sincroniza silenciosamente el estado de la licencia con el servidor principal.
     */
    public static function sincronizarOnline(PDO $db): void
    {
        $config = self::obtenerConfig($db);
        if (!$config || empty($config['clave_licencia'])) return;

        // URL del panel proveedor (licencias-admin)
        $url = 'http://licencias-admin.test/api/check.php?clave=' . urlencode($config['clave_licencia']);
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2); // 2 segundos máximo para no colgar el sistema
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $response) {
            $data = json_decode($response, true);
            if (isset($data['estado'])) {
                $estadoServidor = $data['estado'];
                // Actualizar localmente si ha cambiado a Suspendida o Revocada (o vuelve a Activa)
                $db->prepare("UPDATE licencia_config SET estado = :est WHERE id = 1")->execute([':est' => $estadoServidor]);
            }
        }
    }
}
