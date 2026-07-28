<?php
class Medico {
    private $conn;
    private $table = 'medicos';

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. LEER
    public function leer() {
        $query = 'SELECT m.id_medico, m.colegiatura, m.id_especialidad,
                         u.id_usuario, u.nombre, u.email, u.telefono, u.estado,
                         e.nombre as especialidad
                  FROM ' . $this->table . ' m
                  JOIN usuarios u ON m.id_usuario = u.id_usuario
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                  ORDER BY u.nombre ASC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // 2. OBTENER POR ID
    public function obtenerPorId($id) {
        $query = "SELECT m.id_medico, m.colegiatura, u.nombre, u.email, e.nombre as especialidad 
                  FROM " . $this->table . " m 
                  JOIN usuarios u ON m.id_usuario = u.id_usuario 
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad 
                  WHERE m.id_medico = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 3. VERIFICAR HORARIO LABORAL
    // Primero revisa si hay un horario específico para esa fecha exacta.
    // Si no hay, cae al horario recurrente por día de la semana.
    public function verificaHorarioLaboral($id_medico, $fecha_hora) {
        $dias = [
            'Monday' => 'Lunes', 'Tuesday' => 'Martes', 'Wednesday' => 'Miércoles',
            'Thursday' => 'Jueves', 'Friday' => 'Viernes', 'Saturday' => 'Sábado', 'Sunday' => 'Domingo'
        ];

        $timestamp  = strtotime($fecha_hora);
        $dia_ingles = date('l', $timestamp);
        $dia_es     = $dias[$dia_ingles] ?? '';
        $hora_cita  = date('H:i:s', $timestamp);
        $fecha_cita = date('Y-m-d', $timestamp);

        // 1. ¿Existe horario ESPECÍFICO para exactamente esa fecha?
        $sqlEspecifico = "SELECT COUNT(*) FROM horarios_medicos 
                          WHERE id_medico = :id 
                          AND fecha_especifica = :fecha 
                          AND :hora >= hora_inicio 
                          AND :hora < hora_fin";
        $stmtE = $this->conn->prepare($sqlEspecifico);
        $stmtE->bindParam(':id',    $id_medico);
        $stmtE->bindParam(':fecha', $fecha_cita);
        $stmtE->bindParam(':hora',  $hora_cita);
        $stmtE->execute();

        if ($stmtE->fetchColumn() > 0) {
            return true; // Hay turno específico para ese día → válido
        }

        // 2. ¿Existe algún horario ESPECÍFICO para ese mismo día (fecha)?
        //    Si existe pero no coincide la hora, bloqueamos (no caemos al recurrente)
        $sqlTieneEspecifico = "SELECT COUNT(*) FROM horarios_medicos 
                               WHERE id_medico = :id 
                               AND fecha_especifica = :fecha";
        $stmtT = $this->conn->prepare($sqlTieneEspecifico);
        $stmtT->bindParam(':id',    $id_medico);
        $stmtT->bindParam(':fecha', $fecha_cita);
        $stmtT->execute();

        if ($stmtT->fetchColumn() > 0) {
            return false; // Hay turnos específicos ese día pero ninguno cubre la hora
        }

        // 3. Sin horario específico: usar el horario RECURRENTE del día de la semana
        $sqlRecurrente = "SELECT COUNT(*) FROM horarios_medicos 
                          WHERE id_medico = :id 
                          AND dia_semana = :dia 
                          AND fecha_especifica IS NULL
                          AND :hora >= hora_inicio 
                          AND :hora < hora_fin";
        $stmtR = $this->conn->prepare($sqlRecurrente);
        $stmtR->bindParam(':id',  $id_medico);
        $stmtR->bindParam(':dia', $dia_es);
        $stmtR->bindParam(':hora', $hora_cita);
        $stmtR->execute();

        return $stmtR->fetchColumn() > 0;
    }

    // 4. CREAR
    public function crear($datos) {
        try {
            $this->conn->beginTransaction();
            $queryUser = "INSERT INTO usuarios (nombre, email, password, id_rol, estado) VALUES (:nombre, :email, :password, 2, 1)";
            $stmtUser = $this->conn->prepare($queryUser);
            $passHash = password_hash($datos['password'], PASSWORD_BCRYPT);
            $stmtUser->bindParam(':nombre',   $datos['nombre']);
            $stmtUser->bindParam(':email',    $datos['email']);
            $stmtUser->bindParam(':password', $passHash);
            $stmtUser->execute();
            $id_usuario = $this->conn->lastInsertId();
            $queryMedico = "INSERT INTO medicos (id_usuario, id_especialidad, colegiatura) VALUES (:id_usuario, :id_especialidad, :colegiatura)";
            $stmtMedico = $this->conn->prepare($queryMedico);
            $stmtMedico->bindParam(':id_usuario',     $id_usuario);
            $stmtMedico->bindParam(':id_especialidad', $datos['id_especialidad']);
            $stmtMedico->bindParam(':colegiatura',    $datos['colegiatura']);
            $stmtMedico->execute();
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // 5. ACTUALIZAR
    public function actualizar($datos) {
        try {
            $this->conn->beginTransaction();
            $sqlUser = "UPDATE usuarios SET nombre = :nombre, email = :email";
            if (!empty($datos['password'])) { $sqlUser .= ", password = :password"; }
            $sqlUser .= " WHERE id_usuario = :id_usuario";
            $stmtUser = $this->conn->prepare($sqlUser);
            $stmtUser->bindParam(':nombre',     $datos['nombre']);
            $stmtUser->bindParam(':email',      $datos['email']);
            $stmtUser->bindParam(':id_usuario', $datos['id_usuario']);
            if (!empty($datos['password'])) {
                $passHash = password_hash($datos['password'], PASSWORD_BCRYPT);
                $stmtUser->bindParam(':password', $passHash);
            }
            $stmtUser->execute();
            $sqlMedico = "UPDATE medicos SET id_especialidad = :id_especialidad, colegiatura = :colegiatura WHERE id_medico = :id_medico";
            $stmtMedico = $this->conn->prepare($sqlMedico);
            $stmtMedico->bindParam(':id_especialidad', $datos['id_especialidad']);
            $stmtMedico->bindParam(':colegiatura',     $datos['colegiatura']);
            $stmtMedico->bindParam(':id_medico',       $datos['id_medico']);
            $stmtMedico->execute();
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // 6. CAMBIAR ESTADO
    public function cambiarEstado($id_usuario, $nuevoEstado) {
        $query = 'UPDATE usuarios SET estado = :estado WHERE id_usuario = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':estado', $nuevoEstado);
        $stmt->bindParam(':id',     $id_usuario);
        return $stmt->execute();
    }

    // --- HORARIOS ---

    // Horarios recurrentes (sin fecha específica)
    public function obtenerHorariosRecurrentes($id_medico) {
        $orden = "FIELD(dia_semana,'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')";
        $query = "SELECT * FROM horarios_medicos 
                  WHERE id_medico = :id_medico AND fecha_especifica IS NULL 
                  ORDER BY $orden, hora_inicio";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Horarios por fecha específica
    public function obtenerHorariosEspecificos($id_medico) {
        $query = "SELECT * FROM horarios_medicos 
                  WHERE id_medico = :id_medico AND fecha_especifica IS NOT NULL 
                  ORDER BY fecha_especifica ASC, hora_inicio ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Mantener método original por compatibilidad
    public function obtenerHorarios($id_medico) {
        $query = "SELECT * FROM horarios_medicos WHERE id_medico = :id_medico ORDER BY dia_semana, hora_inicio";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Agregar horario (recurrente o específico)
    public function agregarHorario($id_medico, $dia, $inicio, $fin, $fecha_especifica = null) {
        $query = "INSERT INTO horarios_medicos (id_medico, dia_semana, fecha_especifica, hora_inicio, hora_fin) 
                  VALUES (:id, :dia, :fecha, :inicio, :fin)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id',    $id_medico);
        $stmt->bindParam(':dia',   $dia);
        $stmt->bindParam(':fecha', $fecha_especifica);
        $stmt->bindParam(':inicio', $inicio);
        $stmt->bindParam(':fin',    $fin);
        return $stmt->execute();
    }

    public function eliminarHorario($id_horario) {
        $query = "DELETE FROM horarios_medicos WHERE id_horario = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id_horario);
        return $stmt->execute();
    }

    // Personal de turno hoy (usa horarios recurrentes y específicos)
    public function obtenerPersonalDeTurnoHoy() {
        $dias = [
            'Monday' => 'Lunes', 'Tuesday' => 'Martes', 'Wednesday' => 'Miércoles',
            'Thursday' => 'Jueves', 'Friday' => 'Viernes', 'Saturday' => 'Sábado', 'Sunday' => 'Domingo'
        ];
        $diaHoy   = $dias[date('l')] ?? date('l');
        $fechaHoy = date('Y-m-d');

        $query = "SELECT m.id_medico, u.nombre, e.nombre as especialidad,
                         h.hora_inicio, h.hora_fin, h.dia_semana, h.fecha_especifica
                  FROM horarios_medicos h
                  JOIN medicos m ON h.id_medico = m.id_medico
                  JOIN usuarios u ON m.id_usuario = u.id_usuario
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                  WHERE (
                      (h.fecha_especifica = :fecha)
                      OR (h.fecha_especifica IS NULL AND h.dia_semana = :dia AND u.estado = 1
                          AND m.id_medico NOT IN (
                              SELECT id_medico FROM horarios_medicos WHERE fecha_especifica = :fecha2
                          ))
                  )
                  AND u.estado = 1
                  ORDER BY h.hora_inicio ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':fecha',  $fechaHoy);
        $stmt->bindParam(':dia',    $diaHoy);
        $stmt->bindParam(':fecha2', $fechaHoy);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}