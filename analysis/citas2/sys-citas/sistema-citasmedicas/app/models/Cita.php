<?php
class Cita {
    private $conn;
    private $table = 'citas';

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. OBTENER PRÓXIMAS CITAS (Para el Dashboard)
    public function obtenerProximasCitas($limit = 10) {
        $query = "SELECT c.id_cita, c.fecha_cita, c.estado, 
                         u.nombre as paciente, 
                         m_u.nombre as medico, 
                         e.nombre as especialidad
                  FROM " . $this->table . " c
                  JOIN usuarios u ON c.id_paciente = u.id_usuario
                  JOIN medicos m ON c.id_medico = m.id_medico
                  JOIN usuarios m_u ON m.id_usuario = m_u.id_usuario
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                  WHERE c.fecha_cita >= CURDATE() 
                  AND c.estado != 'Cancelada'
                  ORDER BY c.fecha_cita ASC
                  LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 2. OBTENER HORARIOS OCUPADOS (Para validación visual en Modal)
    public function obtenerHorariosOcupados($id_medico, $fecha) {
        $query = "SELECT DATE_FORMAT(fecha_cita, '%H:%i') as hora 
                  FROM " . $this->table . " 
                  WHERE id_medico = :medico 
                  AND DATE(fecha_cita) = :fecha 
                  AND estado != 'Cancelada' 
                  AND estado != 'Finalizada'
                  ORDER BY fecha_cita ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':medico', $id_medico);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // 3. OBTENER DATOS PARA COBRO (Para módulo Caja)
    public function obtenerParaCobro($id) {
        $query = "SELECT c.id_cita, c.id_servicio, u.nombre as paciente, s.nombre_servicio, s.precio 
                  FROM " . $this->table . " c 
                  JOIN usuarios u ON c.id_paciente = u.id_usuario 
                  JOIN servicios s ON c.id_servicio = s.id_servicio 
                  WHERE c.id_cita = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // 4. LISTAR CITAS (Con filtros de fecha, estado y datos de pago)
    public function leer($fecha_desde = null, $fecha_hasta = null, $estado = null, $id_medico = null, $id_paciente = null) {
        $query = 'SELECT c.id_cita, c.fecha_cita, c.motivo, c.estado, c.id_medico, c.id_paciente, c.id_servicio,
                         c.diagnostico, c.prescripcion, c.tratamiento,
                         c.peso, c.talla, c.temperatura, c.presion_arterial,
                         c.fc, c.fr, c.sat_o2, c.dias_reposo, c.fecha_fin_reposo,
                         c.tiempo_enfermedad, c.motivo_consulta, c.enfermedad_actual,
                         c.antecedentes, c.examen_fisico, c.examenes_auxiliares,
                         c.fecha_control, c.id_interconsulta_especialidad,
                         u.nombre as paciente, u.email as paciente_email, u.telefono as paciente_telefono,
                         u.documento_identidad, u.fecha_nacimiento, u.sexo,
                         u.persona_responsable, u.tel_responsable, u.nro_historia_clinica,
                         m_u.nombre as medico, e.nombre as especialidad, m.colegiatura,
                         s.nombre_servicio, s.precio,
                         p.id_pago, p.metodo_pago, p.fecha_pago, p.monto as monto_pagado
                  FROM ' . $this->table . ' c
                  JOIN usuarios u ON c.id_paciente = u.id_usuario
                  JOIN medicos m ON c.id_medico = m.id_medico
                  JOIN usuarios m_u ON m.id_usuario = m_u.id_usuario
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                  LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
                  LEFT JOIN pagos p ON c.id_cita = p.id_cita'; 
        
        $condiciones = [];
        
        // Filtro por rango de fechas
        if ($fecha_desde && $fecha_hasta) {
            $condiciones[] = 'DATE(c.fecha_cita) BETWEEN :desde AND :hasta';
        } elseif ($fecha_desde) {
            $condiciones[] = 'DATE(c.fecha_cita) >= :desde';
        }

        if ($estado) $condiciones[] = 'c.estado = :estado';
        if ($id_medico) $condiciones[] = 'c.id_medico = :medico_id';
        if ($id_paciente) $condiciones[] = 'c.id_paciente = :paciente_id';

        if (count($condiciones) > 0) $query .= ' WHERE ' . implode(' AND ', $condiciones);
        $query .= ' ORDER BY c.fecha_cita ASC';
        
        $stmt = $this->conn->prepare($query);
        
        if ($fecha_desde && $fecha_hasta) {
            $stmt->bindParam(':desde', $fecha_desde);
            $stmt->bindParam(':hasta', $fecha_hasta);
        } elseif ($fecha_desde) {
            $stmt->bindParam(':desde', $fecha_desde);
        }

        if ($estado) $stmt->bindParam(':estado', $estado);
        if ($id_medico) $stmt->bindParam(':medico_id', $id_medico);
        if ($id_paciente) $stmt->bindParam(':paciente_id', $id_paciente);
        
        $stmt->execute();
        return $stmt;
    }

    // 5. VERIFICAR DISPONIBILIDAD (Para evitar choques)
    public function verificarDisponibilidad($id_medico, $fecha_cita, $id_cita_excluir = null) {
        $sql = "SELECT COUNT(*) FROM " . $this->table . " 
                WHERE id_medico = :medico 
                AND fecha_cita = :fecha 
                AND estado != 'Cancelada' 
                AND estado != 'Finalizada'";
        
        if($id_cita_excluir) {
            $sql .= " AND id_cita != :id";
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':medico', $id_medico);
        $stmt->bindParam(':fecha', $fecha_cita);
        
        if($id_cita_excluir) {
            $stmt->bindParam(':id', $id_cita_excluir);
        }
        
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    // --- CRUD BÁSICO ---
    public function crear($datos) {
        $query = 'INSERT INTO ' . $this->table . ' (id_paciente, id_medico, id_servicio, fecha_cita, motivo, estado) VALUES (:paciente, :medico, :servicio, :fecha, :motivo, "Pendiente")';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':paciente', $datos['id_paciente']); $stmt->bindParam(':medico', $datos['id_medico']); $stmt->bindParam(':servicio', $datos['id_servicio']); $stmt->bindParam(':fecha', $datos['fecha_cita']); $stmt->bindParam(':motivo', $datos['motivo']);
        return $stmt->execute();
    }

    public function actualizar($datos) {
        $query = 'UPDATE ' . $this->table . ' SET id_medico = :medico, id_servicio = :servicio, fecha_cita = :fecha, motivo = :motivo, estado = :estado WHERE id_cita = :id';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $datos['id_cita']); $stmt->bindParam(':medico', $datos['id_medico']); $stmt->bindParam(':servicio', $datos['id_servicio']); $stmt->bindParam(':fecha', $datos['fecha_cita']); $stmt->bindParam(':motivo', $datos['motivo']); $stmt->bindParam(':estado', $datos['estado']);
        return $stmt->execute();
    }

    public function guardarProgresoAtencion($id, $datos) {
        $query = "UPDATE " . $this->table . " SET
            peso = :peso, talla = :talla, presion_arterial = :presion,
            temperatura = :temp, fc = :fc, fr = :fr, sat_o2 = :sat_o2,
            tiempo_enfermedad = :tiempo_enf, motivo_consulta = :motivo_consulta,
            enfermedad_actual = :enf_actual, antecedentes = :antecedentes,
            examen_fisico = :examen_fisico, examenes_auxiliares = :examenes_aux,
            diagnostico = :diagnostico, prescripcion = :prescripcion,
            tratamiento = :tratamiento, dias_reposo = :dias,
            fecha_fin_reposo = :fecha_fin, fecha_control = :fecha_control,
            id_interconsulta_especialidad = :interconsulta
            WHERE id_cita = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id',              $id);
        $stmt->bindParam(':peso',            $datos['peso']);
        $stmt->bindParam(':talla',           $datos['talla']);
        $stmt->bindParam(':presion',         $datos['presion_arterial']);
        $stmt->bindParam(':temp',            $datos['temperatura']);
        $stmt->bindParam(':fc',              $datos['fc']);
        $stmt->bindParam(':fr',              $datos['fr']);
        $stmt->bindParam(':sat_o2',          $datos['sat_o2']);
        $stmt->bindParam(':tiempo_enf',      $datos['tiempo_enfermedad']);
        $stmt->bindParam(':motivo_consulta', $datos['motivo_consulta']);
        $stmt->bindParam(':enf_actual',      $datos['enfermedad_actual']);
        $stmt->bindParam(':antecedentes',    $datos['antecedentes']);
        $stmt->bindParam(':examen_fisico',   $datos['examen_fisico']);
        $stmt->bindParam(':examenes_aux',    $datos['examenes_auxiliares']);
        $stmt->bindParam(':diagnostico',     $datos['diagnostico']);
        $stmt->bindParam(':prescripcion',    $datos['prescripcion']);
        $stmt->bindParam(':tratamiento',     $datos['tratamiento']);
        $stmt->bindParam(':dias',            $datos['dias_reposo']);
        $stmt->bindParam(':fecha_fin',       $datos['fecha_fin_reposo']);
        $stmt->bindParam(':fecha_control',   $datos['fecha_control']);
        $stmt->bindParam(':interconsulta',   $datos['id_interconsulta_especialidad']);
        return $stmt->execute();
    }

    public function finalizarAtencion($id, $datos) {
        $query = "UPDATE " . $this->table . " SET
            peso = :peso, talla = :talla, presion_arterial = :presion,
            temperatura = :temp, fc = :fc, fr = :fr, sat_o2 = :sat_o2,
            tiempo_enfermedad = :tiempo_enf, motivo_consulta = :motivo_consulta,
            enfermedad_actual = :enf_actual, antecedentes = :antecedentes,
            examen_fisico = :examen_fisico, examenes_auxiliares = :examenes_aux,
            diagnostico = :diagnostico, prescripcion = :prescripcion,
            tratamiento = :tratamiento, dias_reposo = :dias,
            fecha_fin_reposo = :fecha_fin, fecha_control = :fecha_control,
            id_interconsulta_especialidad = :interconsulta,
            estado = 'Finalizada'
            WHERE id_cita = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id',              $id);
        $stmt->bindParam(':peso',            $datos['peso']);
        $stmt->bindParam(':talla',           $datos['talla']);
        $stmt->bindParam(':presion',         $datos['presion_arterial']);
        $stmt->bindParam(':temp',            $datos['temperatura']);
        $stmt->bindParam(':fc',              $datos['fc']);
        $stmt->bindParam(':fr',              $datos['fr']);
        $stmt->bindParam(':sat_o2',          $datos['sat_o2']);
        $stmt->bindParam(':tiempo_enf',      $datos['tiempo_enfermedad']);
        $stmt->bindParam(':motivo_consulta', $datos['motivo_consulta']);
        $stmt->bindParam(':enf_actual',      $datos['enfermedad_actual']);
        $stmt->bindParam(':antecedentes',    $datos['antecedentes']);
        $stmt->bindParam(':examen_fisico',   $datos['examen_fisico']);
        $stmt->bindParam(':examenes_aux',    $datos['examenes_auxiliares']);
        $stmt->bindParam(':diagnostico',     $datos['diagnostico']);
        $stmt->bindParam(':prescripcion',    $datos['prescripcion']);
        $stmt->bindParam(':tratamiento',     $datos['tratamiento']);
        $stmt->bindParam(':dias',            $datos['dias_reposo']);
        $stmt->bindParam(':fecha_fin',       $datos['fecha_fin_reposo']);
        $stmt->bindParam(':fecha_control',   $datos['fecha_control']);
        $stmt->bindParam(':interconsulta',   $datos['id_interconsulta_especialidad']);
        return $stmt->execute();
    }

    // Obtener detalle completo de una cita (para AJAX pre-carga del modal)
    public function obtenerDetalleCita($id_cita) {
        $query = "SELECT c.*, 
                         u.nombre as paciente, u.documento_identidad, u.telefono as paciente_telefono,
                         u.fecha_nacimiento, u.sexo, u.persona_responsable, u.tel_responsable, u.nro_historia_clinica,
                         u.alergias, u.enfermedades_cronicas, u.grupo_sanguineo,
                         m_u.nombre as medico, e.nombre as especialidad,
                         s.nombre_servicio
                  FROM citas c
                  JOIN usuarios u ON c.id_paciente = u.id_usuario
                  JOIN medicos m ON c.id_medico = m.id_medico
                  JOIN usuarios m_u ON m.id_usuario = m_u.id_usuario
                  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                  LEFT JOIN servicios s ON c.id_servicio = s.id_servicio
                  WHERE c.id_cita = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id_cita);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function eliminar($id) {
        $query = 'UPDATE ' . $this->table . ' SET estado = "Cancelada" WHERE id_cita = :id';
        $stmt = $this->conn->prepare($query); $stmt->bindParam(':id', $id); return $stmt->execute();
    }

    // --- ESTADÍSTICAS ---
    public function contarTotal($id_medico = null, $id_paciente = null) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table; $condiciones = [];
        if ($id_medico) $condiciones[] = "id_medico = :medico"; if ($id_paciente) $condiciones[] = "id_paciente = :paciente";
        if (count($condiciones) > 0) $query .= " WHERE " . implode(' AND ', $condiciones);
        $stmt = $this->conn->prepare($query);
        if ($id_medico) $stmt->bindParam(':medico', $id_medico); if ($id_paciente) $stmt->bindParam(':paciente', $id_paciente);
        $stmt->execute(); $row = $stmt->fetch(PDO::FETCH_ASSOC); return $row['total'];
    }

    public function obtenerEstadisticasEstado($id_medico = null, $id_paciente = null) {
        $query = "SELECT estado, COUNT(*) as cantidad FROM " . $this->table; $condiciones = [];
        if ($id_medico) $condiciones[] = "id_medico = :medico"; if ($id_paciente) $condiciones[] = "id_paciente = :paciente";
        if (count($condiciones) > 0) $query .= " WHERE " . implode(' AND ', $condiciones);
        $query .= " GROUP BY estado"; $stmt = $this->conn->prepare($query);
        if ($id_medico) $stmt->bindParam(':medico', $id_medico); if ($id_paciente) $stmt->bindParam(':paciente', $id_paciente);
        $stmt->execute(); return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- NUEVAS ESTADÍSTICAS OPERATIVAS ---

    // Citas pendientes del mes actual
    public function contarCitasPendientesMes($id_medico = null) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table
               . " WHERE estado = 'Pendiente'"
               . " AND YEAR(fecha_cita) = YEAR(CURDATE())"
               . " AND MONTH(fecha_cita) = MONTH(CURDATE())";
        if ($id_medico) $query .= " AND id_medico = :medico";
        $stmt = $this->conn->prepare($query);
        if ($id_medico) $stmt->bindParam(':medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    // Citas pendientes del día de hoy
    public function contarCitasPendientesHoy($id_medico = null) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table
               . " WHERE estado = 'Pendiente'"
               . " AND DATE(fecha_cita) = CURDATE()";
        if ($id_medico) $query .= " AND id_medico = :medico";
        $stmt = $this->conn->prepare($query);
        if ($id_medico) $stmt->bindParam(':medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    // Servicios realizados hoy (Finalizadas + con pago registrado)
    public function contarServiciosRealizadosHoy($id_medico = null) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table . " c"
               . " INNER JOIN pagos p ON c.id_cita = p.id_cita"
               . " WHERE c.estado = 'Finalizada'"
               . " AND DATE(p.fecha_pago) = CURDATE()";
        if ($id_medico) $query .= " AND c.id_medico = :medico";
        $stmt = $this->conn->prepare($query);
        if ($id_medico) $stmt->bindParam(':medico', $id_medico);
        $stmt->execute();
        return $stmt->fetchColumn();
    }
}