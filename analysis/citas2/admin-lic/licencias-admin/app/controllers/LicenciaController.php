<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/LicenciaModel.php';

class LicenciaController {

    private function db() { return (new Database())->connect(); }
    private function model($db) { return new LicenciaModel($db); }

    public function index() {
        $db       = $this->db();
        $model    = $this->model($db);
        $model->sincronizarEstados();
        $filtros  = [];
        if (!empty($_GET['id_empresa'])) $filtros['id_empresa'] = (int)$_GET['id_empresa'];
        if (!empty($_GET['estado']))     $filtros['estado']     = $_GET['estado'];
        $licencias = $model->getLicencias($filtros);
        $empresas  = $model->getEmpresas();
        require_once APP_ROOT . '/views/licencias/index.php';
    }

    public function ver() {
        $id      = (int)($_GET['id'] ?? 0);
        $db      = $this->db();
        $model   = $this->model($db);
        $licencia      = $model->getLicenciaById($id);
        $activaciones  = $model->getActivaciones($id);
        $pagos         = $model->getPagos($id);
        require_once APP_ROOT . '/views/licencias/ver.php';
    }

    public function generar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $db    = $this->db();
            $model = $this->model($db);
            $id    = $model->crearLicencia($_POST);
            header('Location: ' . BASE_URL . '/licencias/ver?id=' . $id . '&ok=1'); exit;
        }
        $db       = $this->db();
        $model    = $this->model($db);
        $empresas = $model->getEmpresas();
        require_once APP_ROOT . '/views/licencias/generar.php';
    }

    public function revocar() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $model = $this->model($db);
        $model->revocarLicencia($id);
        header('Location: ' . BASE_URL . '/licencias?ok=rev'); exit;
    }

    public function suspender() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $model = $this->model($db);
        $model->suspenderLicencia($id);
        
        $back = $_GET['back'] ?? (BASE_URL . '/licencias');
        header('Location: ' . $back . (strpos($back, '?') !== false ? '&' : '?') . 's=susp'); exit;
    }

    public function reactivar() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $model = $this->model($db);
        $model->reactivarLicencia($id);
        
        $back = $_GET['back'] ?? (BASE_URL . '/licencias');
        header('Location: ' . $back . (strpos($back, '?') !== false ? '&' : '?') . 's=reac'); exit;
    }

    public function activaciones() {
        $db           = $this->db();
        $model        = $this->model($db);
        $activaciones = $model->getActivaciones();
        require_once APP_ROOT . '/views/licencias/activaciones.php';
    }

    public function marcarActivada() {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            header('Location: ' . BASE_URL . '/licencias');
            exit;
        }
        $db    = $this->db();
        $model = $this->model($db);

        // Cambiar estado de la licencia a Activa
        $db->prepare("UPDATE licencias SET estado='Activa' WHERE id_licencia = ?")->execute([$id]);

        // Registrar en historial de activaciones con nota manual
        $admin = $_SESSION['admin_lic_nombre'] ?? 'Admin';
        $db->prepare("
            INSERT INTO activaciones (id_licencia, ip_activacion, servidor_info, observacion)
            VALUES (?, ?, ?, ?)
        ")->execute([
            $id,
            $_SERVER['REMOTE_ADDR'] ?? '-',
            'Marcada manualmente por ' . $admin,
            'Activación manual registrada desde el Panel del Proveedor'
        ]);

        header('Location: ' . BASE_URL . '/licencias/ver?id=' . $id . '&ok=activada');
        exit;
    }
}
