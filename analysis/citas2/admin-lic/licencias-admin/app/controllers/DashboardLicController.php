<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/LicenciaModel.php';

class DashboardLicController {
    public function index() {
        $db      = (new Database())->connect();
        $model   = new LicenciaModel($db);
        $metrics = $model->getMetrics();
        require_once APP_ROOT . '/views/dashboard.php';
    }
}
