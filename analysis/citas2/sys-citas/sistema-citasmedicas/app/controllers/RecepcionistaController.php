<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/Recepcionista.php';

class RecepcionistaController {
    
    public function index() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        
        // Solo Admin (Rol 1) puede gestionar recepcionistas
        if (!isset($_SESSION['user_role_id']) || $_SESSION['user_role_id'] != 1) { 
            header('Location: ' . BASE_URL . '/home'); 
            exit; 
        }

        $database = new Database();
        $db = $database->connect();
        
        $recepcionistaModel = new Recepcionista($db);
        $recepcionistas = $recepcionistaModel->leer();
        
        require_once APP_ROOT . '/views/admin/recepcionistas.php';
    }

    public function guardar() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $database = new Database(); 
            $db = $database->connect(); 
            $recepcionistaModel = new Recepcionista($db);
            
            $datos = [
                'nombre' => $_POST['nombre'],
                'email' => $_POST['email'],
                'telefono' => $_POST['telefono'] ?? null,
                'password' => $_POST['password']
            ];

            // Validar que el email no exista
            $stmtTest = $db->prepare('SELECT id_usuario FROM usuarios WHERE email = :email LIMIT 1');
            $stmtTest->bindParam(':email', $datos['email']);
            $stmtTest->execute();
            if ($stmtTest->fetch(PDO::FETCH_ASSOC)) {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=error_email');
                exit;
            }

            if($recepcionistaModel->crear($datos)) {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=creado');
            } else {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=error');
            }
        }
    }

    public function actualizar() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $database = new Database(); 
            $db = $database->connect(); 
            $recepcionistaModel = new Recepcionista($db);
            
            $datos = [
                'id_usuario' => $_POST['id_usuario'],
                'nombre' => $_POST['nombre'],
                'email' => $_POST['email'],
                'telefono' => $_POST['telefono'] ?? null,
                'password' => $_POST['password'] ?? null
            ];

            // Validar email si cambia
            if (!empty($_POST['email'])) {
                $stmtTest = $db->prepare('SELECT id_usuario FROM usuarios WHERE email = :email AND id_usuario != :id LIMIT 1');
                $stmtTest->bindParam(':email', $datos['email']);
                $stmtTest->bindParam(':id', $datos['id_usuario']);
                $stmtTest->execute();
                if ($stmtTest->fetch(PDO::FETCH_ASSOC)) {
                    header('Location: ' . BASE_URL . '/recepcionistas?msg=error_email');
                    exit;
                }
            }

            if($recepcionistaModel->actualizar($datos)) {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=actualizado');
            } else {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=error');
            }
        }
    }

    public function cambiarEstado() {
        if (isset($_GET['id']) && isset($_GET['estado'])) {
            $database = new Database(); 
            $db = $database->connect(); 
            $recepcionistaModel = new Recepcionista($db);
            
            $id = $_GET['id'];
            $estadoActual = intval($_GET['estado']);
            $nuevoEstado = ($estadoActual == 1) ? 0 : 1;
            
            if ($recepcionistaModel->cambiarEstado($id, $nuevoEstado)) {
                $msg = ($nuevoEstado == 1) ? 'activado' : 'desactivado';
                header('Location: ' . BASE_URL . '/recepcionistas?msg=' . $msg);
            } else {
                header('Location: ' . BASE_URL . '/recepcionistas?msg=error');
            }
        } else {
            header('Location: ' . BASE_URL . '/recepcionistas');
        }
    }
}
