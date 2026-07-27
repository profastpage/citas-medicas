<?php
// database_seeder.php
require_once __DIR__ . '/app/config/Database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    // 1. Wipe data safely
    $db->exec("SET FOREIGN_KEY_CHECKS=0;");
    
    // Truncate tables
    $tablesToTruncate = [
        'archivos_paciente', 'auditoria', 'citas', 'gastos', 
        'horarios_medicos', 'interconsultas', 'medicamentos', 
        'medicos', 'pagos', 'servicios', 'sesiones_caja', 'especialidades'
    ];
    
    foreach ($tablesToTruncate as $table) {
        $db->exec("TRUNCATE TABLE `$table`");
    }
    
    // Delete non-admin users
    $db->exec("DELETE FROM `usuarios` WHERE `id_rol` != 1");
    
    // Optionally reset auto-increment for usuarios to maintain compactness
    $stmt = $db->query("SELECT MAX(id_usuario) AS max_id FROM usuarios");
    $max_id = $stmt->fetch(PDO::FETCH_ASSOC)['max_id'] ?: 0;
    $next_id = $max_id + 1;
    $db->exec("ALTER TABLE `usuarios` AUTO_INCREMENT = $next_id");
    
    echo "[OK] Tablas vaciadas correctamente.\n";
    
    // 2. Especialidades
    $especialidadesReal = [
        "Medicina General", "Cardiología", "Pediatría", "Dermatología", 
        "Ginecología", "Oftalmología", "Neurología", "Psiquiatría", 
        "Traumatología", "Gastroenterología"
    ];
    $stmtEsp = $db->prepare("INSERT INTO especialidades (nombre, estado) VALUES (?, 1)");
    $espIds = [];
    foreach ($especialidadesReal as $esp) {
        $stmtEsp->execute([$esp]);
        $espIds[] = $db->lastInsertId();
    }
    echo "[OK] 10 Especialidades insertadas.\n";
    
    // 3. Servicios
    $serviciosReal = [
        ["Consulta Médica General", "Consulta de evaluación primaria", 50.00],
        ["Electrocardiograma", "Examen cardiológico no invasivo", 80.00],
        ["Ecografía Abdominal", "Ultrasonido de cavidad abdominal", 120.00],
        ["Extracción de Verrugas", "Procedimiento dermatológico menor", 70.00],
        ["Terapia Psicológica", "Sesión de evaluación y terapia 60 min", 60.00],
        ["Fondo de Ojo", "Examen oftalmológico detallado", 45.00],
        ["Curación de Heridas", "Limpieza y vendaje de heridas", 30.00],
        ["Aplicación de Inyectables", "Administración intramuscular/intravenosa", 15.00],
        ["Examen Físico Deportivo", "Evaluación apto médico", 55.00],
        ["Nebulización", "Terapia respiratoria 15 minutos", 25.00]
    ];
    $stmtServ = $db->prepare("INSERT INTO servicios (nombre_servicio, descripcion, precio, estado) VALUES (?, ?, ?, 'Activo')");
    $servIds = [];
    foreach ($serviciosReal as $serv) {
        $stmtServ->execute([$serv[0], $serv[1], $serv[2]]);
        $servIds[] = $db->lastInsertId();
    }
    echo "[OK] 10 Servicios insertados.\n";
    
    // 4. Medicamentos
    $medicamentosReal = [
        ["Paracetamol", "Genérico", "Tableta 500mg", 100],
        ["Amoxicilina", "Amoxil", "Cápsula 500mg", 50],
        ["Ibuprofeno", "Advil", "Tableta 400mg", 80],
        ["Loratadina", "Clarityne", "Tableta 10mg", 60],
        ["Omeprazol", "Losec", "Cápsula 20mg", 120],
        ["Salbutamol", "Ventolin", "Inhalador 100mcg", 30],
        ["Azitromicina", "Zithromax", "Tableta 500mg", 40],
        ["Diclofenaco", "Voltaren", "Inyectable 75mg", 90],
        ["Metformina", "Glucophage", "Tableta 850mg", 150],
        ["Losartán", "Cozaar", "Tableta 50mg", 110]
    ];
    $stmtMed = $db->prepare("INSERT INTO medicamentos (nombre_comercial, nombre_generico, presentacion, stock, estado) VALUES (?, ?, ?, ?, 'Activo')");
    foreach ($medicamentosReal as $med) {
        $stmtMed->execute([$med[0], $med[1], $med[2], $med[3]]);
    }
    echo "[OK] 10 Medicamentos insertados.\n";
    
    // 5. Usuarios -> Medicos (Profesionales)
    $medicosNombres = [
        ["Roberto Carlos", "Méndez Silva"], ["Luisa Fernanda", "Gómez Salas"],
        ["Carlos Alberto", "Pérez López"], ["María José", "Velasco Ruiz"],
        ["Jorge Luis", "Domínguez Paredes"], ["Ana Patricia", "Torres Peña"],
        ["Fernando", "Castro Ríos"], ["Gabriela", "Luna Morales"],
        ["Ricardo", "Suárez Vargas"], ["Elena", "Cortés Navarro"]
    ];
    $stmtUsu = $db->prepare("INSERT INTO usuarios (nombre, documento_identidad, email, telefono, password, id_rol, estado, fecha_creacion, sexo) VALUES (?, ?, ?, ?, ?, 2, 1, NOW(), 'M')");
    $stmtMedico = $db->prepare("INSERT INTO medicos (id_usuario, id_especialidad, colegiatura) VALUES (?, ?, ?)");
    $stmtHorario = $db->prepare("INSERT INTO horarios_medicos (id_medico, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, '08:00:00', '18:00:00')");
    $medicosIds = [];
    $password_hash = password_hash('123456', PASSWORD_DEFAULT);
    
    for($i=0; $i<10; $i++) {
        $nombreCompleto = $medicosNombres[$i][0] . " " . $medicosNombres[$i][1];
        $dni = "1000000" . $i;
        $email = strtolower(str_replace(' ', '', $medicosNombres[$i][0])) . "@clinica.com";
        $telefono = "99988877" . $i;
        $stmtUsu->execute([$nombreCompleto, $dni, $email, $telefono, $password_hash]);
        $id_usuario = $db->lastInsertId();
        
        $id_esp = $espIds[$i]; // 1 to 1 mapping with specialties for variety
        $cmp = "CMP" . (30000 + $i);
        $stmtMedico->execute([$id_usuario, $id_esp, $cmp]);
        $id_medico = $db->lastInsertId();
        $medicosIds[] = $id_medico;
        
        // Asignar un par de horarios por defecto
        $stmtHorario->execute([$id_medico, 'Lunes']);
        $stmtHorario->execute([$id_medico, 'Miercoles']);
        $stmtHorario->execute([$id_medico, 'Viernes']);
    }
    echo "[OK] 10 Profesionales insertados con horarios.\n";
    
    // 6. Usuarios -> Pacientes
    $pacientesNombres = [
        ["Alejandro", "Martínez Torres"], ["Valeria", "García Medina"],
        ["Santiago", "López Rivas"], ["Camila", "Rodríguez Cruz"],
        ["Sebastián", "Hernández Gil"], ["Sofía", "Flores Aguilar"],
        ["Mateo", "González Reyes"], ["Isabella", "Pérez Santos"],
        ["Diego", "Ramírez Ortiz"], ["Valentina", "Sánchez Vega"]
    ];
    $stmtPacUsu = $db->prepare("INSERT INTO usuarios (nombre, documento_identidad, email, telefono, password, id_rol, estado, fecha_creacion, nro_historia_clinica, fecha_nacimiento, sexo, grupo_sanguineo) VALUES (?, ?, ?, ?, ?, 3, 1, NOW(), ?, ?, ?, ?)");
    $pacientesIds = [];
    $tipoSangre = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "O+", "A+", "O+"];
    $sexoPac = ["M","F","M","F","M","F","M","F","M","F"];
    
    for($i=0; $i<10; $i++) {
        $nombreCompleto = $pacientesNombres[$i][0] . " " . $pacientesNombres[$i][1];
        $dni = "4000000" . $i;
        $email = strtolower(str_replace(' ', '', $pacientesNombres[$i][0])) . "@gmail.com";
        $telefono = "98765432" . $i;
        $hc = "HC-" . date("Y") . "-" . str_pad($i+1, 4, "0", STR_PAD_LEFT);
        $fnac = date("Y-m-d", strtotime("-" . rand(18, 65) . " years"));
        
        $stmtPacUsu->execute([$nombreCompleto, $dni, $email, $telefono, $password_hash, $hc, $fnac, $sexoPac[$i], $tipoSangre[$i]]);
        $pacientesIds[] = $db->lastInsertId();
    }
    echo "[OK] 10 Pacientes insertados.\n";
    
    // 7. Citas
    $estadosCita = ["Pendiente", "Finalizada", "Cancelada", "Finalizada", "Pendiente", "Finalizada", "Finalizada", "Pendiente", "Finalizada", "Finalizada"];
    $stmtCita = $db->prepare("INSERT INTO citas (id_paciente, id_medico, id_servicio, fecha_cita, motivo, estado, motivo_consulta, enfermedad_actual, examen_fisico, diagnostico, prescripcion, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $citasIds = [];
    $citasCompletadasIds = [];
    
    for($i=0; $i<10; $i++) {
        $estado = $estadosCita[$i];
        // Distribuir fechas: algunas hoy, otras ayer, otras mañana
        $dias_dif = rand(-5, 5);
        $hora = rand(8, 17) . ":00:00";
        $fecha_cita = date('Y-m-d', strtotime("$dias_dif days")) . " " . $hora;
        
        $motivo = "Consulta médica de evaluación.";
        $motivo_consulta = "Paciente se presenta por dolor en zona afectada.";
        $enf_actual = "Paciente refiere 3 días de dolor localizado.";
        $ex_fisico = "Constantes vitales estables. Ligeramente adolorido a la palpación.";
        $diag = "Trastorno médico en revisión, de presunta gravedad leve.";
        $prescripcion = "Reposo por 3 días y mucha hidratación.";
        
        if($estado == 'Pendiente' || $estado == 'Cancelada') {
            $diag = ""; $prescripcion = ""; $enf_actual = ""; $ex_fisico = ""; $motivo_consulta = "";
        }
        
        $stmtCita->execute([$pacientesIds[$i], $medicosIds[$i], $servIds[$i], $fecha_cita, $motivo, $estado, $motivo_consulta, $enf_actual, $ex_fisico, $diag, $prescripcion]);
        $id_cita = $db->lastInsertId();
        $citasIds[] = $id_cita;
        if($estado == 'Finalizada') {
            $citasCompletadasIds[] = ['id' => $id_cita, 'id_servicio' => $servIds[$i]];
        }
    }
    echo "[OK] 10 Citas insertadas.\n";
    
    // 8. Sesión de Caja y Movimientos (Pagos y Gastos)
    // Abriendo caja con el administrador (usuario 1)
    $stmtCaja = $db->prepare("INSERT INTO sesiones_caja (id_usuario, monto_apertura, fecha_apertura, estado) VALUES (1, 100.00, NOW(), 'Abierta')");
    $stmtCaja->execute();
    $id_sesion = $db->lastInsertId();
    
    // Pagos por las citas completadas
    $stmtPago = $db->prepare("INSERT INTO pagos (id_cita, monto, metodo_pago, observaciones, fecha_pago) VALUES (?, ?, ?, 'Abono completo', NOW())");
    $metodos = ["Efectivo", "Tarjeta", "Transferencia"];
    foreach($citasCompletadasIds as $citaC) {
        $precio = 50.00; // default
        // Buscar precio real
        foreach($serviciosReal as $idx => $s) {
            if($servIds[$idx] == $citaC['id_servicio']) {
                $precio = $s[2]; break;
            }
        }
        $metodo = $metodos[array_rand($metodos)];
        $stmtPago->execute([$citaC['id'], $precio, $metodo]);
    }
    
    // Gastos representativos
    $gastosMuestra = [
        ["Compra de insumos de limpieza", 45.50],
        ["Material de escritorio", 35.00] // Solo 2 gastos para balancear
    ];
    $stmtGasto = $db->prepare("INSERT INTO gastos (id_sesion, descripcion, monto, fecha_gasto) VALUES (?, ?, ?, NOW())");
    foreach($gastosMuestra as $g) {
        $stmtGasto->execute([$id_sesion, $g[0], $g[1]]);
    }
    echo "[OK] Movimientos de Caja (Apertura, Pagos vinculados y Gastos) insertados.\n";
    
    // Re-enable FX Checks
    $db->exec("SET FOREIGN_KEY_CHECKS=1;");
    
    echo "\n=== OPERACION COMPLETADA CON EXITO ===\n";
    
} catch(PDOException $e) {
    echo "Error de BD: " . $e->getMessage();
} catch(Exception $e) {
    echo "Error: " . $e->getMessage();
}
