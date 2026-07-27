<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/Sistema.php';

class SistemaController {
    
    public function index() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        
        // Solo Admin (Rol 1) puede ver esto
        if (!isset($_SESSION['user_role_id']) || $_SESSION['user_role_id'] != 1) { 
            header('Location: ' . BASE_URL . '/home'); 
            exit; 
        }

        require_once APP_ROOT . '/views/admin/sistema_reset.php';
    }

    public function ejecutarReset() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        
        // Seguridad: Solo Admin
        if ($_SESSION['user_role_id'] != 1) { header('Location: ' . BASE_URL . '/home'); exit; }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $password = $_POST['password'];
            $userId = $_SESSION['user_id'];

            try {
                $database = new Database();
                $db = $database->connect();
                $sistemaModel = new Sistema($db);

                // 1. Verificamos la contraseña
                if ($sistemaModel->verificarPasswordAdmin($userId, $password)) {
                    
                    // 2. Reset en una conexión fresca para evitar cursores pendientes
                    $db2 = (new Database())->connect();
                    $sistemaModel2 = new Sistema($db2);

                    if ($sistemaModel2->restablecerSistema()) {
                        session_destroy();
                        header('Location: ' . BASE_URL . '/login?msg=reset_ok');
                    } else {
                        header('Location: ' . BASE_URL . '/sistema?msg=error_db');
                    }

                } else {
                    header('Location: ' . BASE_URL . '/sistema?msg=error_pass');
                }
            } catch (Exception $e) {
                error_log('[ejecutarReset] ' . $e->getMessage());
                header('Location: ' . BASE_URL . '/sistema?msg=error_db&detail=' . urlencode($e->getMessage()));
            }
        }
        exit;
    }


    public function backup() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (!isset($_SESSION['user_role_id']) || $_SESSION['user_role_id'] != 1) { header('Location: ' . BASE_URL . '/home'); exit; }

        $database = new Database();
        $db = $database->connect();
        $dbname = "sistema_citas_medicas_db"; // As per config/Database.php

        try {
            $tables = array();
            $stmt = $db->query('SHOW TABLES');
            while($row = $stmt->fetch(PDO::FETCH_NUM)){
                $tables[] = $row[0];
            }

            $sqlScript = "-- Copia de Seguridad de $dbname\n-- Generado el " . date('Y-m-d H:i:s') . "\n\n";
            $sqlScript .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

            foreach($tables as $table){
                $stmt = $db->query("SHOW CREATE TABLE $table");
                $row = $stmt->fetch(PDO::FETCH_NUM);
                $sqlScript .= "DROP TABLE IF EXISTS `$table`;\n";
                $sqlScript .= $row[1] . ";\n\n";

                $stmt = $db->query("SELECT * FROM $table");
                $columnCount = $stmt->columnCount();

                while($row = $stmt->fetch(PDO::FETCH_NUM)){
                    $sqlScript .= "INSERT INTO `$table` VALUES(";
                    for($j = 0; $j < $columnCount; $j++){
                        if(isset($row[$j])) {
                            $val = $db->quote($row[$j]);
                            $sqlScript .= $val;
                        } else {
                            $sqlScript .= "NULL";
                        }
                        if($j < ($columnCount-1)) $sqlScript .= ',';
                    }
                    $sqlScript .= ");\n";
                }
                $sqlScript .= "\n";
            }
            
            $sqlScript .= "SET FOREIGN_KEY_CHECKS=1;\n";

            $backup_file_name = $dbname . '_backup_' . date("Y-m-d_H-i-s") . '.sql';
            header('Content-Type: application/x-sql');
            header('Content-Disposition: attachment; filename=' . $backup_file_name);
            header('Pragma: no-cache');
            header('Expires: 0');
            echo $sqlScript;
            exit;

        } catch(PDOException $e) {
            header('Location: ' . BASE_URL . '/sistema?msg=backup_error');
            exit;
        }
    }

    public function restaurar() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        if (!isset($_SESSION['user_role_id']) || $_SESSION['user_role_id'] != 1) { header('Location: ' . BASE_URL . '/home'); exit; }

        if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['backup_file'])) {
            $file = $_FILES['backup_file'];

            if ($file['error'] == UPLOAD_ERR_OK) {
                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                if (strtolower($ext) !== 'sql') {
                    header('Location: ' . BASE_URL . '/sistema?msg=restore_invalid');
                    exit;
                }

                $sql = file_get_contents($file['tmp_name']);
                if (!$sql) {
                    header('Location: ' . BASE_URL . '/sistema?msg=restore_error');
                    exit;
                }

                $database = new Database();
                $db = $database->connect();

                try {
                    // Disable foreign keys temporarily while restoring
                    $db->exec("SET FOREIGN_KEY_CHECKS=0;");
                    $db->exec($sql);
                    $db->exec("SET FOREIGN_KEY_CHECKS=1;");
                    
                    header('Location: ' . BASE_URL . '/sistema?msg=restore_ok');
                    exit;
                } catch(PDOException $e) {
                    // Restore foreign key constraint check if failure happens inside
                    $db->exec("SET FOREIGN_KEY_CHECKS=1;");
                    header('Location: ' . BASE_URL . '/sistema?msg=restore_error_db');
                    exit;
                }
            } else {
                header('Location: ' . BASE_URL . '/sistema?msg=restore_error');
                exit;
            }
        }
        header('Location: ' . BASE_URL . '/sistema');
        exit;
    }
}