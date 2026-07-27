<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-0">Gestión de Horarios</h4>
        <p class="text-muted mb-0">Profesional: <strong class="text-primary"><?php echo $medico['nombre']; ?></strong> | Especialidad: <?php echo $medico['especialidad']; ?></p>
    </div>
    <a href="<?php echo BASE_URL; ?>/medicos" class="btn btn-secondary"><i class="fas fa-arrow-left me-2"></i> Volver</a>
</div>

<!-- ===== HORARIOS RECURRENTES (por día de la semana) ===== -->
<div class="row mb-4">
    <div class="col-md-4">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-primary text-white fw-bold">
                <i class="fas fa-redo me-2"></i> Turno Recurrente (Semanal)
            </div>
            <div class="card-body">
                <p class="text-muted small mb-3">Se repite <strong>todas</strong> las semanas en el mismo día.</p>
                <form action="<?php echo BASE_URL; ?>/medicos/guardarHorario" method="POST">
                    <input type="hidden" name="id_medico" value="<?php echo $_GET['id']; ?>">
                    <input type="hidden" name="fecha_especifica" value="">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Día de la Semana</label>
                        <select name="dia" class="form-select" required>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label class="form-label fw-bold">Inicio</label>
                            <input type="time" name="inicio" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold">Fin</label>
                            <input type="time" name="fin" class="form-control" required>
                        </div>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save me-2"></i> Agregar Recurrente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white fw-bold text-secondary">
                <i class="fas fa-calendar-alt me-2"></i> Horarios Recurrentes Asignados
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Día</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th class="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if(empty($horarios)): ?>
                                <tr>
                                    <td colspan="4" class="text-center py-3 text-muted">
                                        <i class="fas fa-info-circle me-2"></i> Sin horarios recurrentes.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach($horarios as $h): ?>
                                <tr>
                                    <td class="ps-4 fw-bold text-primary"><?php echo $h['dia_semana']; ?></td>
                                    <td><?php echo date('h:i A', strtotime($h['hora_inicio'])); ?></td>
                                    <td><?php echo date('h:i A', strtotime($h['hora_fin'])); ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo BASE_URL; ?>/medicos/eliminarHorario?id=<?php echo $h['id_horario']; ?>&id_medico=<?php echo $_GET['id']; ?>" 
                                           class="btn btn-sm btn-outline-danger border-0"
                                           onclick="return confirm('¿Eliminar este horario?');">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ===== HORARIOS POR FECHA ESPECÍFICA ===== -->
<hr class="my-4">
<h5 class="fw-bold mb-3 text-secondary"><i class="fas fa-calendar-day me-2"></i> Turnos por Fecha Específica</h5>
<p class="text-muted small mb-3">
    Úsalo para indicar disponibilidad en un día concreto (ej: <em>sólo el lunes 16 de marzo</em>).
    Si un día tiene turnos específicos, <strong>se ignoran los recurrentes</strong> para esa fecha.
</p>

<div class="row">
    <div class="col-md-4">
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-success text-white fw-bold">
                <i class="fas fa-calendar-plus me-2"></i> Agregar Turno por Fecha
            </div>
            <div class="card-body">
                <form action="<?php echo BASE_URL; ?>/medicos/guardarHorario" method="POST">
                    <input type="hidden" name="id_medico" value="<?php echo $_GET['id']; ?>">
                    <div class="mb-3">
                        <label class="form-label fw-bold">Fecha Exacta</label>
                        <input type="date" name="fecha_especifica" class="form-control" required min="<?php echo date('Y-m-d'); ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold">Día <span class="text-muted small">(se autocompletará)</span></label>
                        <select name="dia" id="diaEspecifico" class="form-select" required>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label class="form-label fw-bold">Inicio</label>
                            <input type="time" name="inicio" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold">Fin</label>
                            <input type="time" name="fin" class="form-control" required>
                        </div>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-calendar-check me-2"></i> Agregar Turno
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white fw-bold text-secondary">
                <i class="fas fa-list-alt me-2"></i> Turnos Específicos Asignados
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Fecha</th>
                                <th>Día</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                                <th class="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if(empty($horariosEspecificos)): ?>
                                <tr>
                                    <td colspan="5" class="text-center py-3 text-muted">
                                        <i class="fas fa-info-circle me-2"></i> Sin turnos específicos registrados.
                                    </td>
                                </tr>
                            <?php else: ?>
                                <?php foreach($horariosEspecificos as $h): ?>
                                <?php
                                    // Resaltar si la fecha ya pasó
                                    $pasado = strtotime($h['fecha_especifica']) < strtotime(date('Y-m-d'));
                                ?>
                                <tr class="<?php echo $pasado ? 'text-muted' : ''; ?>">
                                    <td class="ps-4 fw-bold <?php echo $pasado ? '' : 'text-success'; ?>">
                                        <?php echo date('d/m/Y', strtotime($h['fecha_especifica'])); ?>
                                        <?php if($pasado): ?><span class="badge bg-secondary ms-1">Pasado</span><?php endif; ?>
                                    </td>
                                    <td><?php echo $h['dia_semana']; ?></td>
                                    <td><?php echo date('h:i A', strtotime($h['hora_inicio'])); ?></td>
                                    <td><?php echo date('h:i A', strtotime($h['hora_fin'])); ?></td>
                                    <td class="text-center">
                                        <a href="<?php echo BASE_URL; ?>/medicos/eliminarHorario?id=<?php echo $h['id_horario']; ?>&id_medico=<?php echo $_GET['id']; ?>" 
                                           class="btn btn-sm btn-outline-danger border-0"
                                           onclick="return confirm('¿Eliminar este turno específico?');">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Autocompletar el día de la semana al seleccionar una fecha específica
document.querySelector('input[name="fecha_especifica"]').addEventListener('change', function() {
    const fecha = new Date(this.value + 'T12:00:00'); // mediodía para evitar offset
    const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const nombreDia = dias[fecha.getDay()];
    const select = document.getElementById('diaEspecifico');
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === nombreDia) {
            select.selectedIndex = i;
            break;
        }
    }
});
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>