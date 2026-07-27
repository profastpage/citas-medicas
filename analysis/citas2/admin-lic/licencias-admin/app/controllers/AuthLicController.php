<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/LicenciaModel.php';

class AuthLicController {
    public function login() {
        require_once APP_ROOT . '/views/auth/login.php';
    }

    public function authenticate() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: ' . BASE_URL . '/login'); exit; }
        $email    = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $db       = (new Database())->connect();
        $model    = new LicenciaModel($db);
        $admin    = $model->getAdminByEmail($email);
        if ($admin && password_verify($password, $admin['password'])) {
            session_regenerate_id(true);
            $_SESSION['admin_lic_id']     = $admin['id_admin'];
            $_SESSION['admin_lic_nombre'] = $admin['nombre'];
            $_SESSION['admin_lic_email']  = $admin['email'];
            session_write_close();
            header('Location: ' . BASE_URL . '/dashboard'); exit;
        }
        header('Location: ' . BASE_URL . '/login?error=1'); exit;
    }

    public function logout() {
        $_SESSION = [];
        session_destroy();
        header('Location: ' . BASE_URL . '/login'); exit;
    }
}
