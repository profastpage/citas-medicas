<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/lib/LicenseValidator.php';

class MiLicenciaController
{
    public function index()
    {
        $database = new Database();
        $db = $database->connect();
        // Forzar sincronización al visitar la vista de licencia
        LicenseValidator::sincronizarOnline($db);
        $resultado = LicenseValidator::verificar($db);
        require_once APP_ROOT . '/views/admin/mi_licencia.php';
    }

    public function activar()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: ' . BASE_URL . '/licencia');
            exit;
        }

        $clave          = trim($_POST['clave_licencia'] ?? '');
        $ruc            = trim($_POST['ruc_empresa'] ?? '');
        $fecha_fin      = trim($_POST['fecha_vencimiento'] ?? '');
        $id_empresa     = (int)($_POST['id_empresa'] ?? 0);
        $empresa_nombre = trim($_POST['empresa_nombre'] ?? '');

        if (!$clave || !$ruc || !$fecha_fin || !$id_empresa) {
            header('Location: ' . BASE_URL . '/licencia?error=campos');
            exit;
        }

        $database = new Database();
        $db = $database->connect();

        $resultado = LicenseValidator::activar($db, $clave, $ruc, $fecha_fin, $id_empresa, $empresa_nombre);

        if ($resultado['ok']) {
            // Registrar la activación también en licencias_db (opcional, si tiene acceso)
            $_SESSION['lic_mensaje'] = $resultado['mensaje'];
            header('Location: ' . BASE_URL . '/licencia?activada=1');
        } else {
            $_SESSION['lic_error'] = $resultado['mensaje'];
            header('Location: ' . BASE_URL . '/licencia?error=invalida');
        }
        exit;
    }

    /** Activación online deshabilitada — redirige a la página de licencia */
    public function activarOnline()
    {
        header('Location: ' . BASE_URL . '/licencia');
        exit;
    }

    /** Pantalla de licencia requerida (bloqueo) */
    public function requerida()
    {
        $database = new Database();
        $db = $database->connect();
        $resultado = LicenseValidator::verificar($db);
        require_once APP_ROOT . '/views/admin/licencia_requerida.php';
    }
}
