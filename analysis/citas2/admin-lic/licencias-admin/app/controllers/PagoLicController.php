<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/LicenciaModel.php';

class PagoLicController {

    private function db() { return (new Database())->connect(); }

    public function index() {
        $db    = $this->db();
        $model = new LicenciaModel($db);
        $pagos = $model->getPagos();
        require_once APP_ROOT . '/views/pagos/index.php';
    }

    public function registrar() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/pagos'); exit; }
        $db    = $this->db();
        $model = new LicenciaModel($db);
        $_POST['admin_id'] = $_SESSION['admin_lic_id'] ?? null;
        $model->registrarPago($_POST);
        $back = !empty($_POST['back']) ? $_POST['back'] : BASE_URL . '/pagos';
        header('Location: ' . $back . '?ok=pago'); exit;
    }

    public function anular() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $model = new LicenciaModel($db);
        $model->anularPago($id);
        header('Location: ' . BASE_URL . '/pagos?ok=anulado'); exit;
    }
}
