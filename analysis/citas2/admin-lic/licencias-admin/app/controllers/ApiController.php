<?php
require_once APP_ROOT . '/models/LicenciaModel.php';

class ApiController
{
    private $licenciaModel;

    public function __construct()
    {
        // Configurar cabeceras para API REST JSON
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *'); // Permitir peticiones desde cualquier IP cliente
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        // Manejar peticiones OPTIONS (CORS preflight)
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    /**
     * POST /api/verificar-licencia
     * Recibe JSON con: { "ruc": "20123456789" } o { "id_empresa": 1 }
     * Retorna la licencia activa de esa empresa.
     */
    public function verificarLicencia()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['ok' => false, 'error' => 'Método no permitido. Use POST.'], 405);
        }

        // Leer datos JSON del cuerpo de la petición
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input && !empty($_POST)) {
            $input = $_POST; // Fallback por si lo mandan como Form-Data
        }

        $ruc = trim($input['ruc'] ?? '');
        $id_empresa = (int)($input['id_empresa'] ?? 0);

        if (empty($ruc) && empty($id_empresa)) {
            $this->jsonResponse(['ok' => false, 'error' => 'Debe proporcionar el RUC o el ID de Empresa.'], 400);
        }

        // Buscar empresa por RUC o ID
        $empresa = null;
        if (!empty($ruc)) {
            $empresa = $this->obtenerEmpresaPorCampo('ruc', $ruc);
        }
        if (!$empresa && $id_empresa > 0) {
            $empresa = $this->obtenerEmpresaPorCampo('id_empresa', $id_empresa);
        }

        if (!$empresa) {
            $this->jsonResponse(['ok' => false, 'error' => 'Empresa no encontrada en los registros del proveedor.'], 404);
        }

        // Buscar la licencia activa/vigente más reciente de esta empresa
        $db = (new Database())->connect();
        $stmt = $db->prepare("
            SELECT * FROM licencias 
            WHERE id_empresa = ? AND estado IN ('Activa', 'Pendiente') 
            ORDER BY fecha_fin DESC LIMIT 1
        ");
        $stmt->execute([$empresa['id_empresa']]);
        $licencia = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$licencia) {
            $this->jsonResponse(['ok' => false, 'error' => 'La empresa no tiene ninguna licencia activa.'], 404);
        }

        // Retornar los datos para auto-activación
        $this->jsonResponse([
            'ok' => true,
            'licencia' => [
                'id_empresa'        => (int)$empresa['id_empresa'],
                'ruc_empresa'       => $empresa['ruc'],
                'empresa_nombre'    => $empresa['razon_social'],
                'clave_licencia'    => $licencia['clave_licencia'],
                'fecha_vencimiento' => $licencia['fecha_fin'],
                'estado'            => $licencia['estado']
            ]
        ], 200);
    }

    /**
     * Utilidad: buscar empresa
     */
    private function obtenerEmpresaPorCampo($campo, $valor)
    {
        $db = (new Database())->connect();
        $stmt = $db->prepare("SELECT * FROM empresas WHERE $campo = ? LIMIT 1");
        $stmt->execute([$valor]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Utilidad: enviar respuesta JSON estructurada y detener ejecución
     */
    private function jsonResponse($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}
