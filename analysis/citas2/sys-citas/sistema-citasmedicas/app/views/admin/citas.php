<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="row mb-4 g-4">

    <!-- Tarjeta 1: Citas Pendientes del Mes -->
    <div class="col-md-3">
        <div class="card border-0 shadow-sm text-white h-100" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); border-radius:16px;">
            <div class="card-body d-flex flex-column justify-content-between p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="bg-white bg-opacity-20 rounded-3 p-3">
                        <i class="fas fa-calendar-alt fa-lg"></i>
                    </div>
                    <a href="<?php echo BASE_URL; ?>/citas" class="text-white bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center text-decoration-none" style="width:34px;height:34px;">
                        <i class="fas fa-arrow-right small"></i>
                    </a>
                </div>
                <div>
                    <h3 class="fw-bolder mb-0"><?php echo $citasPendientesMes; ?></h3>
                    <small class="text-white fw-semibold text-uppercase" style="letter-spacing:1px;">Citas Pendientes del Mes</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Tarjeta 2: Citas Pendientes del Día -->
    <div class="col-md-3">
        <div class="card border-0 shadow-sm h-100" style="background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%); border-radius:16px;">
            <div class="card-body d-flex flex-column justify-content-between p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="bg-white bg-opacity-25 rounded-3 p-3">
                        <i class="fas fa-clock fa-lg"></i>
                    </div>
                    <a href="<?php echo BASE_URL; ?>/citas" class="text-dark bg-white bg-opacity-30 rounded-circle d-flex align-items-center justify-content-center text-decoration-none" style="width:34px;height:34px;">
                        <i class="fas fa-arrow-right small"></i>
                    </a>
                </div>
                <div>
                    <h3 class="fw-bolder mb-0 text-dark"><?php echo $citasPendientesHoy; ?></h3>
                    <small class="text-dark fw-semibold text-uppercase" style="letter-spacing:1px;">Citas Pendientes del Día</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Tarjeta 3: Servicios Realizados Hoy -->
    <div class="col-md-3">
        <div class="card border-0 shadow-sm text-white h-100" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius:16px;">
            <div class="card-body d-flex flex-column justify-content-between p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="bg-white bg-opacity-25 rounded-3 p-3">
                        <i class="fas fa-check-circle fa-lg"></i>
                    </div>
                    <a href="<?php echo BASE_URL; ?>/caja" class="text-white bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center text-decoration-none" style="width:34px;height:34px;">
                        <i class="fas fa-arrow-right small"></i>
                    </a>
                </div>
                <div>
                    <h3 class="fw-bolder mb-0"><?php echo $serviciosRealizadosHoy; ?></h3>
                    <small class="text-white fw-semibold text-uppercase" style="letter-spacing:1px;">Servicios Realizados Hoy</small>
                </div>
            </div>
        </div>
    </div>

    <!-- Tarjeta 4: Personal de Turno -->
    <div class="col-md-3">
        <div class="card border-0 shadow-sm text-white h-100" style="background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%); border-radius:16px;">
            <div class="card-body d-flex flex-column justify-content-between p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div class="bg-white bg-opacity-10 rounded-3 p-3">
                        <i class="fas fa-user-md fa-lg"></i>
                    </div>
                    <button onclick="document.getElementById('modalPersonalTurnoCitas').style.display='flex'"
                        class="text-white bg-white border-0 bg-opacity-15 rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                        style="font-size:0.8rem; cursor:pointer;">
                        <i class="fas fa-eye small"></i> <span>Ver</span>
                    </button>
                </div>
                <div>
                    <h3 class="fw-bolder mb-0"><?php echo count($personalDeTurno); ?></h3>
                    <small class="text-white fw-semibold text-uppercase" style="letter-spacing:1px;">Personal de Turno Hoy</small>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal: Personal de Turno (Citas) -->
<div id="modalPersonalTurnoCitas" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9999; align-items:center; justify-content:center;">
    <div class="card shadow-lg" style="width:100%; max-width:560px; border-radius:20px; overflow:hidden;">
        <div class="card-header d-flex justify-content-between align-items-center py-3 px-4" style="background: linear-gradient(135deg, #1a1a2e, #0f3460);">
            <h5 class="text-white fw-bold mb-0"><i class="fas fa-user-clock me-2"></i> Personal de Turno — <?php echo date('l d \d\e F', time()); ?></h5>
            <button onclick="document.getElementById('modalPersonalTurnoCitas').style.display='none'"
                style="background:rgba(255,255,255,0.15); border:none; color:#fff; border-radius:50%; width:32px; height:32px; cursor:pointer; font-size:1rem;">&times;</button>
        </div>
        <div class="card-body p-0">
            <?php if (!empty($personalDeTurno)): ?>
                <ul class="list-group list-group-flush">
                    <?php foreach ($personalDeTurno as $p): ?>
                        <li class="list-group-item d-flex align-items-center px-4 py-3 border-bottom">
                            <div class="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                style="width:44px;height:44px;background:linear-gradient(135deg,#6a11cb,#2575fc);">
                                <span class="text-white fw-bold fs-5"><?php echo strtoupper(substr($p['nombre'], 0, 1)); ?></span>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold text-dark"><?php echo htmlspecialchars($p['nombre']); ?></h6>
                                <small class="text-muted"><?php echo htmlspecialchars($p['especialidad']); ?></small>
                            </div>
                            <span class="badge rounded-pill px-3 py-2" style="background:#e8f5e9; color:#2e7d32; font-size:0.82rem;">
                                <i class="fas fa-clock me-1"></i>
                                <?php echo substr($p['hora_inicio'],0,5); ?> – <?php echo substr($p['hora_fin'],0,5); ?>
                            </span>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php else: ?>
                <div class="text-center py-5">
                    <i class="fas fa-moon fa-3x text-muted mb-3"></i>
                    <p class="text-muted fw-medium">No hay profesionales con turno asignado hoy.</p>
                </div>
            <?php endif; ?>
        </div>
        <div class="card-footer text-end bg-light border-0 px-4 py-3">
            <button onclick="document.getElementById('modalPersonalTurnoCitas').style.display='none'"
                class="btn btn-sm btn-primary rounded-pill">Cerrar</button>
        </div>
    </div>
</div>


<div class="card shadow border-0 mb-4">
    <div class="card-body">
        <form method="GET" action="<?php echo BASE_URL; ?>/citas" class="row g-3 align-items-end">
            <div class="col-md-3">
                <label class="form-label fw-bold">Fecha Desde</label>
                <input type="date" name="fecha_desde" class="form-control" value="<?php echo $fecha_desde; ?>">
            </div>
            <div class="col-md-3">
                <label class="form-label fw-bold">Fecha Hasta</label>
                <input type="date" name="fecha_hasta" class="form-control" value="<?php echo $fecha_hasta; ?>">
            </div>
            
            <div class="col-md-3">
                <label class="form-label fw-bold">Estado</label>
                <select name="estado" class="form-select">
                    <option value="">Todos</option>
                    <option value="Pendiente" <?php echo (isset($_GET['estado']) && $_GET['estado'] == 'Pendiente') ? 'selected' : ''; ?>>Pendiente</option>
                    <option value="Finalizada" <?php echo (isset($_GET['estado']) && $_GET['estado'] == 'Finalizada') ? 'selected' : ''; ?>>Finalizada</option>
                    <option value="Cancelada" <?php echo (isset($_GET['estado']) && $_GET['estado'] == 'Cancelada') ? 'selected' : ''; ?>>Cancelada</option>
                </select>
            </div>
            <div class="col-md-1">
                <button type="submit" class="btn btn-primary w-100" title="Filtrar"><i class="fas fa-filter"></i></button>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-success w-100" data-bs-toggle="modal" data-bs-target="#modalNuevaCita">
                    <i class="fas fa-plus"></i> Nueva Cita
                </button>
            </div>
        </form>
    </div>
</div>

<div class="card shadow border-0">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4">Fecha / Hora</th>
                        <th>Paciente</th>
                        <th>Profesional / Especialidad</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                        <th>Pago</th> <th class="text-end pe-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultado && $resultado->rowCount() > 0): ?>
                        <?php while ($cita = $resultado->fetch(PDO::FETCH_ASSOC)): ?>
                            <?php 
                                // Color del Estado de la Cita
                                $badgeColor = match($cita['estado']) {
                                    'Pendiente' => 'bg-warning text-dark',
                                    'Finalizada' => 'bg-success',
                                    'Cancelada' => 'bg-danger',
                                    default => 'bg-secondary'
                                };

                                // Lógica visual de Pago
                                // Si id_pago tiene valor, significa que ya existe registro en pagos
                                $estaPagado = !empty($cita['id_pago']); 
                                $badgePago = $estaPagado 
                                    ? '<span class="badge bg-success bg-opacity-75"><i class="fas fa-check me-1"></i>Pagado</span>' 
                                    : '<span class="badge bg-danger bg-opacity-75"><i class="fas fa-times me-1"></i>Pendiente</span>';
                            ?>
                            <tr>
                                <td class="ps-4">
                                    <div class="fw-bold"><?php echo date('d/m/Y', strtotime($cita['fecha_cita'])); ?></div>
                                    <div class="small text-muted"><?php echo date('H:i A', strtotime($cita['fecha_cita'])); ?></div>
                                </td>
                                <td>
                                    <div class="d-flex flex-column">
                                        <span class="fw-bold"><?php echo $cita['paciente']; ?></span>
                                        <small class="text-muted"><?php echo $cita['paciente_telefono']; ?></small>
                                    </div>
                                </td>
                                <td>
                                    <div class="d-flex flex-column">
                                        <span class="text-primary"><?php echo $cita['medico']; ?></span>
                                        <small class="text-muted"><?php echo $cita['especialidad']; ?></small>
                                    </div>
                                </td>
                                <td><?php echo $cita['motivo']; ?></td>
                                <td><span class="badge <?php echo $badgeColor; ?>"><?php echo $cita['estado']; ?></span></td>
                                
                                <td><?php echo $badgePago; ?></td>

                                <td class="text-end pe-4">
                                    <?php if($cita['estado'] == 'Pendiente' || $cita['estado'] == 'Finalizada'): ?>
                                        
                                        <?php if(!$estaPagado): ?>
                                            <a href="<?php echo BASE_URL; ?>/citas/cobrar?id=<?php echo $cita['id_cita']; ?>" class="btn btn-sm btn-outline-success" title="Cobrar">
                                                <i class="fas fa-cash-register"></i>
                                            </a>
                                        <?php else: ?>
                                            <button class="btn btn-sm btn-success disabled border-0" title="Cobro Realizado"><i class="fas fa-check-double"></i></button>
                                        <?php endif; ?>

                                        <a href="<?php echo BASE_URL; ?>/citas/atender?id=<?php echo $cita['id_cita']; ?>" class="btn btn-sm btn-outline-primary" title="Atender">
                                            <i class="fas fa-stethoscope"></i>
                                        </a>
                                        
                                        <?php if($cita['estado'] == 'Pendiente'): ?>
                                            <a href="<?php echo BASE_URL; ?>/citas/eliminar?id=<?php echo $cita['id_cita']; ?>" class="btn btn-sm btn-outline-danger" 
                                            onclick="return confirm('¿Cancelar cita?')"><i class="fas fa-times"></i></a>
                                        <?php endif; ?>

                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="7" class="text-center py-4 text-muted">No se encontraron citas en este rango de fechas.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="modalNuevaCita" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">Agendar Nueva Cita</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form action="<?php echo BASE_URL; ?>/citas/guardar" method="POST">
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Paciente</label>
                            <select name="id_paciente" class="form-select" required>
                                <option value="">Seleccione...</option>
                                <?php 
                                if($pacientes) {
                                    $pacientes->execute();
                                    while($p = $pacientes->fetch(PDO::FETCH_ASSOC)) {
                                        echo "<option value='".$p['id_usuario']."'>".$p['nombre']." - ".$p['documento_identidad']."</option>";
                                    }
                                }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Servicio</label>
                            <select name="id_servicio" class="form-select" required>
                                <option value="">Seleccione...</option>
                                <?php 
                                if($servicios) {
                                    $servicios->execute();
                                    while($s = $servicios->fetch(PDO::FETCH_ASSOC)) {
                                        echo "<option value='".$s['id_servicio']."'>".$s['nombre_servicio']." (S/ ".$s['precio'].")</option>";
                                    }
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Profesional</label>
                            <select name="id_medico" id="selectMedico" class="form-select" required>
                                <option value="">Seleccione...</option>
                                <?php 
                                if($medicos) {
                                    $medicos->execute();
                                    while($m = $medicos->fetch(PDO::FETCH_ASSOC)) {
                                        echo "<option value='".$m['id_medico']."'>".$m['nombre']." (".$m['especialidad'].")</option>";
                                    }
                                }
                                ?>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Fecha</label>
                            <input type="date" name="fecha" id="inputFecha" class="form-control" required min="<?php echo date('Y-m-d'); ?>">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Hora</label>
                            <input type="time" name="hora" class="form-control" required>
                        </div>
                    </div>

                    <div id="infoHorarios" class="mb-3 p-3 bg-light rounded border" style="display:none;">
                        <label class="form-label fw-bold text-secondary mb-2"><i class="fas fa-history me-1"></i> Horarios ya reservados para este día:</label>
                        <div id="listaHoras" class="d-flex flex-wrap gap-2"></div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Motivo de Consulta</label>
                        <textarea name="motivo" class="form-control" rows="2" required></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Guardar Cita</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    // ─── AJAX disponibilidad horaria ─────────────────────────────────────────
    document.addEventListener("DOMContentLoaded", function() {
        const selectMedico = document.getElementById('selectMedico');
        const inputFecha   = document.getElementById('inputFecha');
        const infoHorarios = document.getElementById('infoHorarios');
        const listaHoras   = document.getElementById('listaHoras');

        function consultarHorarios() {
            const idMedico = selectMedico?.value;
            const fecha    = inputFecha?.value;
            if (idMedico && fecha) {
                fetch(`<?php echo BASE_URL; ?>/citas/verificarHorarios?id_medico=${idMedico}&fecha=${fecha}`)
                    .then(r => r.json())
                    .then(data => {
                        listaHoras.innerHTML = '';
                        infoHorarios.style.display = 'block';
                        if (data.length > 0) {
                            data.forEach(c => {
                                const badge = document.createElement('span');
                                badge.className = 'badge bg-danger bg-opacity-75 text-white p-2 fw-normal';
                                badge.innerHTML = `<i class="fas fa-clock me-1"></i> ${c.hora}`;
                                listaHoras.appendChild(badge);
                            });
                        } else {
                            listaHoras.innerHTML = '<span class="text-success fw-bold"><i class="fas fa-check-circle me-1"></i> Todo el día disponible</span>';
                        }
                    })
                    .catch(() => infoHorarios.style.display = 'none');
            } else {
                if (infoHorarios) infoHorarios.style.display = 'none';
            }
        }

        if (selectMedico) selectMedico.addEventListener('change', consultarHorarios);
        if (inputFecha)   inputFecha.addEventListener('change', consultarHorarios);

        // Alerta de fecha control cuando se seleccione
        const fechaControlEl = document.getElementById('v_fecha_control');
        if (fechaControlEl) {
            fechaControlEl.addEventListener('change', function() {
                if (this.value) {
                    const d = new Date(this.value + 'T12:00:00');
                    const str = d.toLocaleDateString('es-PE', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
                    Swal.fire({
                        icon: 'info', title: 'Cita de Control',
                        text: `Se registrará cita de control para el ${str}. El recepcionista deberá agendarla.`,
                        confirmButtonColor: '#0f3460', timer: 4000, timerProgressBar: true
                    });
                }
            });
        }
    });

    // ─── Alertas de mensajes URL ─────────────────────────────────────────────
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg) {
        let data = { title: 'Notificación', icon: 'info', text: 'Acción realizada' };
        if(msg === 'creado')       data = { title: 'Cita Agendada',      icon: 'success', text: 'La cita se registró correctamente.' };
        else if(msg === 'atendido') data = { title: 'Atención Finalizada', icon: 'success', text: 'Historia clínica actualizada correctamente.' };
        else if(msg === 'eliminado') data = { title: 'Cita Cancelada',   icon: 'warning', text: 'La cita ha sido anulada.' };
        else if(msg === 'ocupado')  data = { title: 'Horario Ocupado',    icon: 'error',   text: 'El profesional ya tiene una cita a esa hora.' };
        else if(msg === 'fuera_horario') data = { title: 'Fuera de Horario', icon: 'error', text: 'El profesional no atiende ese día o a esa hora.' };
        else if(msg === 'error')    data = { title: 'Error',              icon: 'error',   text: 'Ocurrió un error. Verifique los datos.' };
        Swal.fire({ title: data.title, text: data.text, icon: data.icon, confirmButtonColor: '#0d6efd' })
            .then(() => window.history.replaceState({}, document.title, window.location.pathname));
    }
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>