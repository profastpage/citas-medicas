<?php
/**
 * Generador y Validador de Claves de Licencia
 * HMAC-SHA256 offline — sin servidor central
 *
 * IMPORTANTE: LIC_SECRET_KEY debe ser IDÉNTICA en:
 *   - Este archivo (panel del proveedor)
 *   - app/lib/LicenseValidator.php (sistema cliente)
 */
define('LIC_SECRET_KEY', 'S!st3m@C1t@sM3d2024#XK9');
define('LIC_GRACE_DAYS', 5);  // Días de gracia tras vencimiento

class LicenciaModel {

    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    // ──────────────────────────────────────────────
    // GENERACIÓN DE CLAVE (HMAC-SHA256)
    // ──────────────────────────────────────────────
    /**
     * Genera la clave de licencia reproducible:
     * HMAC_SHA256( ruc|fecha_fin|id_empresa , LIC_SECRET_KEY )
     */
    public static function generarClave(string $ruc, string $fecha_fin, int $id_empresa): string {
        $data = strtoupper(trim($ruc)) . '|' . $fecha_fin . '|' . $id_empresa;
        return hash_hmac('sha256', $data, LIC_SECRET_KEY);
    }

    // ──────────────────────────────────────────────
    // EMPRESAS
    // ──────────────────────────────────────────────
    public function getEmpresas() {
        $stmt = $this->db->query("
            SELECT e.*,
                   COUNT(l.id_licencia) AS total_licencias,
                   SUM(CASE WHEN l.estado = 'Activa' THEN 1 ELSE 0 END) AS licencias_activas
            FROM empresas e
            LEFT JOIN licencias l ON l.id_empresa = e.id_empresa
            GROUP BY e.id_empresa
            ORDER BY e.fecha_registro DESC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEmpresaById(int $id) {
        $stmt = $this->db->prepare("SELECT * FROM empresas WHERE id_empresa = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function crearEmpresa(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO empresas (razon_social, nombre_comercial, ruc, responsable, email, telefono, direccion, ciudad, notas)
            VALUES (:rs, :nc, :ruc, :resp, :email, :tel, :dir, :ciudad, :notas)
        ");
        $stmt->execute([
            ':rs'     => $data['razon_social'],
            ':nc'     => $data['nombre_comercial'] ?? null,
            ':ruc'    => $data['ruc'] ?? null,
            ':resp'   => $data['responsable'] ?? null,
            ':email'  => $data['email'] ?? null,
            ':tel'    => $data['telefono'] ?? null,
            ':dir'    => $data['direccion'] ?? null,
            ':ciudad' => $data['ciudad'] ?? null,
            ':notas'  => $data['notas'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function actualizarEmpresa(int $id, array $data): bool {
        $stmt = $this->db->prepare("
            UPDATE empresas SET razon_social=:rs, nombre_comercial=:nc, ruc=:ruc,
                responsable=:resp, email=:email, telefono=:tel, direccion=:dir,
                ciudad=:ciudad, estado=:estado, notas=:notas
            WHERE id_empresa = :id
        ");
        return $stmt->execute([
            ':rs'     => $data['razon_social'],
            ':nc'     => $data['nombre_comercial'] ?? null,
            ':ruc'    => $data['ruc'] ?? null,
            ':resp'   => $data['responsable'] ?? null,
            ':email'  => $data['email'] ?? null,
            ':tel'    => $data['telefono'] ?? null,
            ':dir'    => $data['direccion'] ?? null,
            ':ciudad' => $data['ciudad'] ?? null,
            ':estado' => $data['estado'] ?? 'Activo',
            ':notas'  => $data['notas'] ?? null,
            ':id'     => $id,
        ]);
    }

    // ──────────────────────────────────────────────
    // LICENCIAS
    // ──────────────────────────────────────────────
    public function getLicencias(array $filtros = []) {
        $where = '1=1';
        $params = [];
        if (!empty($filtros['id_empresa'])) {
            $where .= ' AND l.id_empresa = :emp';
            $params[':emp'] = $filtros['id_empresa'];
        }
        if (!empty($filtros['estado'])) {
            $where .= ' AND l.estado = :estado';
            $params[':estado'] = $filtros['estado'];
        }
        $stmt = $this->db->prepare("
            SELECT l.*, e.razon_social, e.ruc
            FROM licencias l
            JOIN empresas e ON e.id_empresa = l.id_empresa
            WHERE $where
            ORDER BY l.creado_en DESC
        ");
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLicenciaById(int $id) {
        $stmt = $this->db->prepare("
            SELECT l.*, e.razon_social, e.ruc, e.responsable, e.email AS email_empresa
            FROM licencias l
            JOIN empresas e ON e.id_empresa = l.id_empresa
            WHERE l.id_licencia = :id
        ");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function crearLicencia(array $data): int {
        // Calcular fecha_fin según tipo y cantidad
        $fecha_inicio = new DateTime($data['fecha_inicio']);
        $fecha_fin = clone $fecha_inicio;
        $cantidad = (int)($data['cantidad_periodo'] ?? 1);
        switch ($data['tipo_periodo']) {
            case 'demo':         $fecha_fin->modify("+{$cantidad} days"); break;
            case 'mensual':      $fecha_fin->modify("+{$cantidad} months"); break;
            case 'trimestral':   $meses = $cantidad * 3; $fecha_fin->modify("+{$meses} months"); break;
            case 'semestral':    $meses = $cantidad * 6; $fecha_fin->modify("+{$meses} months"); break;
            case 'anual':        $fecha_fin->modify("+{$cantidad} years"); break;
        }
        $fecha_fin->modify('-1 day'); // último día incluido

        // Obtener RUC de la empresa
        $empresa = $this->getEmpresaById((int)$data['id_empresa']);
        $ruc = $empresa['ruc'] ?? 'SINRUC';

        $clave = self::generarClave($ruc, $fecha_fin->format('Y-m-d'), (int)$data['id_empresa']);

        $stmt = $this->db->prepare("
            INSERT INTO licencias (id_empresa, clave_licencia, tipo_periodo, cantidad_periodo, fecha_inicio, fecha_fin, precio, estado, notas)
            VALUES (:emp, :clave, :tipo, :cantidad, :fi, :ff, :precio, 'Pendiente', :notas)
        ");
        $stmt->execute([
            ':emp'      => $data['id_empresa'],
            ':clave'    => $clave,
            ':tipo'     => $data['tipo_periodo'],
            ':cantidad' => $cantidad,
            ':fi'       => $fecha_inicio->format('Y-m-d'),
            ':ff'       => $fecha_fin->format('Y-m-d'),
            ':precio'   => $data['precio'] ?? 0,
            ':notas'    => $data['notas'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function revocarLicencia(int $id): bool {
        $stmt = $this->db->prepare("UPDATE licencias SET estado='Revocada' WHERE id_licencia=:id");
        return $stmt->execute([':id' => $id]);
    }

    public function suspenderLicencia(int $id): bool {
        $stmt = $this->db->prepare("UPDATE licencias SET estado='Suspendida' WHERE id_licencia=:id");
        return $stmt->execute([':id' => $id]);
    }

    public function reactivarLicencia(int $id): bool {
        $stmt = $this->db->prepare("UPDATE licencias SET estado='Activa' WHERE id_licencia=:id");
        return $stmt->execute([':id' => $id]);
    }

    /** Actualiza estados vencidos automáticamente */
    public function sincronizarEstados(): void {
        $this->db->exec("
            UPDATE licencias SET estado='Vencida'
            WHERE estado='Activa' AND fecha_fin < CURDATE()
        ");
    }

    // ──────────────────────────────────────────────
    // ACTIVACIONES (historial)
    // ──────────────────────────────────────────────
    public function getActivaciones(?int $id_licencia = null) {
        $where = $id_licencia ? "WHERE a.id_licencia = :id" : "";
        $params = $id_licencia ? [':id' => $id_licencia] : [];
        $stmt = $this->db->prepare("
            SELECT a.*, l.clave_licencia, e.razon_social
            FROM activaciones a
            JOIN licencias l ON l.id_licencia = a.id_licencia
            JOIN empresas e ON e.id_empresa = l.id_empresa
            $where
            ORDER BY a.fecha_activacion DESC
        ");
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function registrarActivacion(int $id_licencia, string $ip = '', string $servidor = ''): void {
        $stmt = $this->db->prepare("
            INSERT INTO activaciones (id_licencia, ip_activacion, servidor_info)
            VALUES (:lic, :ip, :srv)
        ");
        $stmt->execute([':lic' => $id_licencia, ':ip' => $ip, ':srv' => $servidor]);
        // Marcar licencia como Activa
        $this->db->prepare("UPDATE licencias SET estado='Activa' WHERE id_licencia=:id")
                 ->execute([':id' => $id_licencia]);
    }

    // ──────────────────────────────────────────────
    // PAGOS
    // ──────────────────────────────────────────────
    public function getPagos(?int $id_licencia = null) {
        $where = $id_licencia ? "AND p.id_licencia = :id" : "";
        $params = $id_licencia ? [':id' => $id_licencia] : [];
        $stmt = $this->db->prepare("
            SELECT p.*, e.razon_social, l.tipo_periodo, l.fecha_fin
            FROM pagos_licencia p
            JOIN licencias l ON l.id_licencia = p.id_licencia
            JOIN empresas e ON e.id_empresa = l.id_empresa
            WHERE 1=1 $where
            ORDER BY p.fecha_pago DESC
        ");
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function registrarPago(array $data): int {
        $stmt = $this->db->prepare("
            INSERT INTO pagos_licencia (id_licencia, monto, moneda, metodo_pago, referencia, estado_pago, observaciones, registrado_por)
            VALUES (:lic, :monto, :moneda, :metodo, :ref, :estado, :obs, :admin)
        ");
        $stmt->execute([
            ':lic'    => $data['id_licencia'],
            ':monto'  => $data['monto'],
            ':moneda' => $data['moneda'] ?? 'PEN',
            ':metodo' => $data['metodo_pago'] ?? null,
            ':ref'    => $data['referencia'] ?? null,
            ':estado' => $data['estado_pago'] ?? 'Pagado',
            ':obs'    => $data['observaciones'] ?? null,
            ':admin'  => $data['admin_id'] ?? null,
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function anularPago(int $id): bool {
        $stmt = $this->db->prepare("UPDATE pagos_licencia SET estado_pago='Anulado' WHERE id_pago=:id");
        return $stmt->execute([':id' => $id]);
    }

    // ──────────────────────────────────────────────
    // DASHBOARD — métricas
    // ──────────────────────────────────────────────
    public function getMetrics(): array {
        $this->sincronizarEstados();
        $r = [];
        $r['total_empresas']   = $this->db->query("SELECT COUNT(*) FROM empresas WHERE estado='Activo'")->fetchColumn();
        $r['licencias_activas'] = $this->db->query("SELECT COUNT(*) FROM licencias WHERE estado='Activa'")->fetchColumn();
        $r['licencias_por_vencer'] = $this->db->query("
            SELECT COUNT(*) FROM licencias
            WHERE estado='Activa' AND fecha_fin BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ")->fetchColumn();
        $r['ingresos_mes'] = $this->db->query("
            SELECT COALESCE(SUM(monto),0) FROM pagos_licencia
            WHERE estado_pago='Pagado' AND MONTH(fecha_pago)=MONTH(CURDATE()) AND YEAR(fecha_pago)=YEAR(CURDATE())
        ")->fetchColumn();
        $r['ultimas_activaciones'] = $this->getActivaciones();
        // Limitar a 5
        $r['ultimas_activaciones'] = array_slice($r['ultimas_activaciones'], 0, 5);
        $r['licencias_recientes'] = $this->getLicencias();
        $r['licencias_recientes'] = array_slice($r['licencias_recientes'], 0, 5);
        return $r;
    }

    // ──────────────────────────────────────────────
    // ADMIN AUTH
    // ──────────────────────────────────────────────
    public function getAdminByEmail(string $email) {
        $stmt = $this->db->prepare("SELECT * FROM admin_licencias WHERE email=:email AND estado=1");
        $stmt->execute([':email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
