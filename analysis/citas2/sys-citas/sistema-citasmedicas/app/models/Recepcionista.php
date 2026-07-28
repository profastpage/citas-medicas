<?php
class Recepcionista {
    private $conn;
    private $table = 'usuarios';

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. LEER
    public function leer() {
        $query = 'SELECT id_usuario, nombre, email, telefono, estado 
                  FROM ' . $this->table . ' 
                  WHERE id_rol = 4 
                  ORDER BY nombre ASC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // 2. CREAR
    public function crear($datos) {
        try {
            $query = "INSERT INTO " . $this->table . " (nombre, email, password, telefono, id_rol, estado) 
                      VALUES (:nombre, :email, :password, :telefono, 4, 1)";
            $stmt = $this->conn->prepare($query);
            
            $passHash = password_hash($datos['password'], PASSWORD_BCRYPT);
            
            $stmt->bindParam(':nombre',   $datos['nombre']);
            $stmt->bindParam(':email',    $datos['email']);
            $stmt->bindParam(':password', $passHash);
            $stmt->bindParam(':telefono', $datos['telefono']);
            
            return $stmt->execute();
        } catch (Exception $e) {
            return false;
        }
    }

    // 3. ACTUALIZAR
    public function actualizar($datos) {
        try {
            $query = "UPDATE " . $this->table . " SET nombre = :nombre, email = :email, telefono = :telefono";
            
            if (!empty($datos['password'])) {
                $query .= ", password = :password";
            }
            
            $query .= " WHERE id_usuario = :id_usuario AND id_rol = 4";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':nombre',     $datos['nombre']);
            $stmt->bindParam(':email',      $datos['email']);
            $stmt->bindParam(':telefono',   $datos['telefono']);
            $stmt->bindParam(':id_usuario', $datos['id_usuario']);
            
            if (!empty($datos['password'])) {
                $passHash = password_hash($datos['password'], PASSWORD_BCRYPT);
                $stmt->bindParam(':password', $passHash);
            }
            
            return $stmt->execute();
        } catch (Exception $e) {
            return false;
        }
    }

    // 4. CAMBIAR ESTADO
    public function cambiarEstado($id_usuario, $nuevoEstado) {
        $query = 'UPDATE ' . $this->table . ' SET estado = :estado WHERE id_usuario = :id AND id_rol = 4';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':estado', $nuevoEstado);
        $stmt->bindParam(':id',     $id_usuario);
        return $stmt->execute();
    }
}
