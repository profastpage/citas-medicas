<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/LicenciaModel.php';

class EmpresaController {

    private function db() { return (new Database())->connect(); }
    private function model($db) { return new LicenciaModel($db); }

    public function index() {
        $db       = $this->db();
        $model    = $this->model($db);
        $empresas = $model->getEmpresas();
        require_once APP_ROOT . '/views/empresas/index.php';
    }

    public function ver() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $model = $this->model($db);
        $empresa   = $model->getEmpresaById($id);
        $licencias = $model->getLicencias(['id_empresa' => $id]);
        $pagos     = $model->getPagos();
        require_once APP_ROOT . '/views/empresas/ver.php';
    }

    public function guardar() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/empresas'); exit; }
        $db    = $this->db();
        $model = $this->model($db);
        $model->crearEmpresa($_POST);
        header('Location: ' . BASE_URL . '/empresas?ok=1'); exit;
    }

    public function actualizar() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/empresas'); exit; }
        $id    = (int)($_POST['id_empresa'] ?? 0);
        $db    = $this->db();
        $model = $this->model($db);
        $model->actualizarEmpresa($id, $_POST);
        header('Location: ' . BASE_URL . '/empresas?ok=2'); exit;
    }

    public function eliminar() {
        $id    = (int)($_GET['id'] ?? 0);
        $db    = $this->db();
        $db->prepare("DELETE FROM empresas WHERE id_empresa=:id")->execute([':id' => $id]);
        header('Location: ' . BASE_URL . '/empresas?ok=3'); exit;
    }
}
