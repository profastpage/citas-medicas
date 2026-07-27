<?php
require_once APP_ROOT . '/config/Database.php';
require_once APP_ROOT . '/models/Cita.php';
require_once APP_ROOT . '/models/Medico.php';
require_once APP_ROOT . '/models/Paciente.php';
require_once APP_ROOT . '/models/Servicio.php';

class CitaController {
    
    public function index() {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $database = new Database(); $db = $database->connect();
        
        $citaModel = new Cita($db);
        $medicoModel = new Medico($db);
        $pacienteModel = new Paciente($db);
        $servicioModel = new Servicio($db);
        
        $rol = $_SESSION['user_role_id'] ?? 0;
        $userId = $_SESSION['user_id'];
        $medicoId = $_SESSION['medico_id'] ?? null;

        // Filtros de fecha (Rango)
        $fecha_desde = $_GET['fecha_desde'] ?? date('Y-m-01');
        $fecha_hasta = $_GET['fecha_hasta'] ?? date('Y-m-t');
        
        $estado = $_GET['estado'] ?? null;
        if($estado == "") $estado = null;

        // Consultar según Rol
        if ($rol == 1 || $rol == 4) { // Admin y Recepción
            $resultado = $citaModel->leer($fecha_desde, $fecha_hasta, $estado);
            $citasPendientesMes     = $citaModel->contarCitasPendientesMes();
            $citasPendientesHoy     = $citaModel->contarCitasPendientesHoy();
            $serviciosRealizadosHoy = $citaModel->contarServiciosRealizadosHoy();
        } elseif ($rol == 2) { // Médico
            $resultado = $citaModel->leer($fecha_desde, $fecha_hasta, $estado, $medicoId);
            $citasPendientesMes     = $citaModel->contarCitasPendientesMes($medicoId);
            $citasPendientesHoy     = $citaModel->contarCitasPendientesHoy($medicoId);
            $serviciosRealizadosHoy = $citaModel->contarServiciosRealizadosHoy($medicoId);
        } elseif ($rol == 3) { // Paciente
            $resultado = $citaModel->leer(null, null, null, null, $userId);
            $citasPendientesMes     = $citaModel->contarCitasPendientesMes();
            $citasPendientesHoy     = $citaModel->contarCitasPendientesHoy();
            $serviciosRealizadosHoy = $citaModel->contarServiciosRealizadosHoy();
        } else {
            $resultado = null;
            $citasPendientesMes = $citasPendientesHoy = $serviciosRealizadosHoy = 0;
        }

        // Personal de turno hoy
        $personalDeTurno = $medicoModel->obtenerPersonalDeTurnoHoy();

        $medicos = $medicoModel->leer();
        $pacientes = $pacienteModel->leer();
        $servicios = $servicioModel->leer();

        require_once APP_ROOT . '/views/admin/citas.php';
    }


    // --- AJAX: Verificar disponibilidad horaria ---
    public function verificarHorarios() {
        if (isset($_GET['id_medico']) && isset($_GET['fecha'])) {
            $database = new Database(); $db = $database->connect(); $citaModel = new Cita($db);
            
            $ocupados = $citaModel->obtenerHorariosOcupados($_GET['id_medico'], $_GET['fecha']);
            
            header('Content-Type: application/json');
            echo json_encode($ocupados);
            exit;
        }
    }

    public function guardar() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $database = new Database(); $db = $database->connect();
            $citaModel = new Cita($db);
            $medicoModel = new Medico($db);

            $id_medico = $_POST['id_medico'];
            $fecha_cita = $_POST['fecha'] . ' ' . $_POST['hora'];

            // 1. Validar horario laboral
            if (!$medicoModel->verificaHorarioLaboral($id_medico, $fecha_cita)) {
                header('Location: ' . BASE_URL . '/citas?msg=fuera_horario'); exit;
            }
            // 2. Validar que no esté ocupado
            if ($citaModel->verificarDisponibilidad($id_medico, $fecha_cita)) {
                header('Location: ' . BASE_URL . '/citas?msg=ocupado'); exit;
            }

            $datos = [
                'id_paciente' => $_POST['id_paciente'], 'id_medico' => $id_medico,
                'id_servicio' => $_POST['id_servicio'], 'fecha_cita' => $fecha_cita,
                'motivo' => $_POST['motivo']
            ];

            if($citaModel->crear($datos)) header('Location: ' . BASE_URL . '/citas?msg=creado');
            else header('Location: ' . BASE_URL . '/citas?msg=error');
        }
    }

    public function actualizar() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $database = new Database(); $db = $database->connect(); $citaModel = new Cita($db);
            $datos = [
                'id_cita' => $_POST['id_cita'], 'id_medico' => $_POST['id_medico'],
                'id_servicio' => $_POST['id_servicio'],
                'fecha_cita' => $_POST['fecha'] . ' ' . $_POST['hora'],
                'motivo' => $_POST['motivo'], 'estado' => $_POST['estado']
            ];
            if($citaModel->actualizar($datos)) header('Location: ' . BASE_URL . '/citas?msg=actualizado');
            else header('Location: ' . BASE_URL . '/citas?msg=error');
        }
    }

    public function atender() {
        if (!isset($_GET['id'])) {
            header('Location: ' . BASE_URL . '/citas');
            exit;
        }
        $database = new Database(); $db = $database->connect();
        
        // El layout se renderiza en atencion_medica.php
        require_once APP_ROOT . '/views/admin/atencion_medica.php';
    }


    public function finalizar() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $database = new Database(); $db = $database->connect(); $citaModel = new Cita($db);
            $dias = intval($_POST['dias_reposo'] ?? 0);
            $fecha_fin = ($dias > 0) ? date('Y-m-d', strtotime("+{$dias} days")) : null;
            $fecha_control = !empty($_POST['fecha_control']) ? $_POST['fecha_control'] : null;
            $interconsulta = !empty($_POST['id_interconsulta_especialidad']) ? (int)$_POST['id_interconsulta_especialidad'] : null;
            
            // Fix for numeric empty fields
            $peso        = (isset($_POST['peso']) && $_POST['peso'] !== '') ? $_POST['peso'] : null;
            $talla       = (isset($_POST['talla']) && $_POST['talla'] !== '') ? $_POST['talla'] : null;
            $temperatura = (isset($_POST['temperatura']) && $_POST['temperatura'] !== '') ? $_POST['temperatura'] : null;
            $fc          = (isset($_POST['fc']) && $_POST['fc'] !== '') ? $_POST['fc'] : null;
            $fr          = (isset($_POST['fr']) && $_POST['fr'] !== '') ? $_POST['fr'] : null;
            $sat_o2      = (isset($_POST['sat_o2']) && $_POST['sat_o2'] !== '') ? $_POST['sat_o2'] : null;

            $datos = [
                'peso'                        => $peso,
                'talla'                       => $talla,
                'presion_arterial'            => ($_POST['pa_sis'] ?? '') . '/' . ($_POST['pa_dia'] ?? ''),
                'temperatura'                 => $temperatura,
                'fc'                          => $fc,
                'fr'                          => $fr,
                'sat_o2'                      => $sat_o2,
                'tiempo_enfermedad'           => $_POST['tiempo_enfermedad']  ?? null,
                'motivo_consulta'             => $_POST['motivo_consulta']    ?? null,
                'enfermedad_actual'           => $_POST['enfermedad_actual']  ?? null,
                'antecedentes'                => $_POST['antecedentes']       ?? null,
                'examen_fisico'               => $_POST['examen_fisico']      ?? null,
                'examenes_auxiliares'         => $_POST['examenes_auxiliares']?? null,
                'diagnostico'                 => $_POST['diagnostico']        ?? null,
                'prescripcion'                => $_POST['prescripcion']       ?? null,
                'tratamiento'                 => $_POST['tratamiento']        ?? null,
                'dias_reposo'                 => $dias,
                'fecha_fin_reposo'            => $fecha_fin,
                'fecha_control'               => $fecha_control,
                'id_interconsulta_especialidad' => $interconsulta,
            ];
            
            $accion = $_POST['accion'] ?? 'finalizar';

            if ($accion === 'guardar') {
                if ($citaModel->guardarProgresoAtencion($_POST['id_cita'], $datos)) {
                    header('Location: ' . BASE_URL . '/citas/atender?id=' . $_POST['id_cita'] . '&msg=guardado');
                } else {
                    header('Location: ' . BASE_URL . '/citas/atender?id=' . $_POST['id_cita'] . '&msg=error');
                }
            } else {
                if ($citaModel->finalizarAtencion($_POST['id_cita'], $datos)) {
                    // Si hay interconsulta, registrarla
                    if ($interconsulta) {
                        $db->prepare("INSERT INTO interconsultas (id_cita, id_especialidad, observaciones) VALUES (?,?,?)") 
                           ->execute([$_POST['id_cita'], $interconsulta, 'Generada desde atención']);
                    }
                    header('Location: ' . BASE_URL . '/citas?msg=atendido');
                } else {
                    header('Location: ' . BASE_URL . '/citas?msg=error');
                }
            }
        }
    }

    public function eliminar() {
        if (isset($_GET['id'])) {
            $database = new Database(); $db = $database->connect(); $citaModel = new Cita($db);
            if ($citaModel->eliminar($_GET['id'])) header('Location: ' . BASE_URL . '/citas?msg=eliminado');
            else header('Location: ' . BASE_URL . '/citas?msg=error');
        }
    }

    public function listarEventos() {}
    public function cobrar() { if(isset($_GET['id'])) header('Location: ' . BASE_URL . '/caja?cita_id=' . $_GET['id']); }

    // AJAX: Obtener detalle completo de una cita para pre-cargar el modal de atención
    public function detalleCita() {
        if (isset($_GET['id'])) {
            $database = new Database(); $db = $database->connect(); $citaModel = new Cita($db);
            $detalle = $citaModel->obtenerDetalleCita($_GET['id']);
            
            // Obtener archivos del paciente
            if ($detalle && isset($detalle['id_paciente'])) {
                $stmtArchivos = $db->prepare("SELECT * FROM archivos_paciente WHERE id_paciente = :id ORDER BY fecha_subida DESC");
                $stmtArchivos->bindParam(':id', $detalle['id_paciente']);
                $stmtArchivos->execute();
                $detalle['archivos'] = $stmtArchivos->fetchAll(PDO::FETCH_ASSOC);
            }

            header('Content-Type: application/json');
            echo json_encode($detalle ?: []);
            exit;
        }
    }
}