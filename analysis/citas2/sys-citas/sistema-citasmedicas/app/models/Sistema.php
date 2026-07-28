<?php
class Sistema {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function verificarPasswordAdmin($id_usuario, $password) {
        $query = "SELECT password FROM usuarios WHERE id_usuario = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id_usuario);
        $stmt->execute();
        
        // fetchAll() vacía el buffer completamente
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $stmt->closeCursor();
        $stmt = null;

        if (count($resultados) > 0) {
            if (password_verify($password, $resultados[0]['password'])) {
                return true;
            }
        }
        return false;
    }

    public function restablecerSistema() {
        // Tablas reales de la BD, en orden de dependencia FK
        // Con FK_CHECKS=0 el orden no importa, pero lo mantenemos limpio
        $tablasALimpiar = [
            'pagos',
            'interconsultas',
            'archivos_paciente',
            'auditoria',
            'gastos',
            'sesiones_caja',
            'citas',
            'horarios_medicos',
            'medicos',
            'especialidades',
            'servicios',
            'medicamentos',
        ];

        try {
            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 0");

            foreach ($tablasALimpiar as $tabla) {
                // TRUNCATE resetea AUTO_INCREMENT y es más eficiente que DELETE
                // Con FK_CHECKS=0 funciona aunque haya referencias externas
                $this->conn->exec("TRUNCATE TABLE `{$tabla}`");
            }

            // Borrar usuarios no-administradores (rol 1 = Admin)
            $this->conn->exec("DELETE FROM `usuarios` WHERE id_rol != 1");

            $this->conn->exec("SET FOREIGN_KEY_CHECKS = 1");

            return true;

        } catch (Exception $e) {
            try { $this->conn->exec("SET FOREIGN_KEY_CHECKS = 1"); } catch (Exception $x) {}
            error_log("[SistemaReset] ERROR: " . $e->getMessage());
            return false;
        }
    }
}