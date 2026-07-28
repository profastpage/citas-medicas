<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="mb-3">
    <a href="<?php echo BASE_URL; ?>/pacientes" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i> Volver al Directorio
    </a>
</div>

<div class="row">
    <div class="col-md-4 mb-4">
        <div class="card shadow border-0 mb-3">
            <div class="card-body text-center pt-4">
                <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style="width: 100px; height: 100px; font-size: 2.5rem;">
                    <i class="fas fa-user"></i>
                </div>
                <h4 class="fw-bold mb-0"><?php echo $paciente['nombre']; ?></h4>
                <p class="text-muted">DNI: <?php echo $paciente['documento_identidad']; ?></p>
                
                <hr>
                
                <div class="text-start">
                    <p class="mb-2"><i class="fas fa-envelope text-primary me-2" style="width:20px"></i> <?php echo $paciente['email']; ?></p>
                    <p class="mb-2"><i class="fas fa-phone text-primary me-2" style="width:20px"></i> <?php echo $paciente['telefono']; ?></p>
                    <p class="mb-2"><i class="fas fa-calendar-alt text-primary me-2" style="width:20px"></i> Reg: <?php echo date('d/m/Y', strtotime($paciente['fecha_creacion'])); ?></p>
                </div>
            </div>
        </div>

        <div class="card shadow border-0 bg-danger text-white">
            <div class="card-header bg-danger border-0 fw-bold">
                <i class="fas fa-heartbeat me-2"></i> Información Médica
            </div>
            <div class="card-body bg-white text-dark border-bottom border-start border-end rounded-bottom">

                <div class="mb-3">
                    <label class="small text-muted fw-bold text-uppercase">Alergias</label>
                    <div class="fst-italic"><?php echo $paciente['alergias'] ?: 'Ninguna registrada'; ?></div>
                </div>
                <div>
                    <label class="small text-muted fw-bold text-uppercase">Enfermedades Crónicas</label>
                    <div class="fst-italic"><?php echo $paciente['enfermedades_cronicas'] ?: 'Ninguna registrada'; ?></div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-8">
        <div class="card shadow border-0">
            <div class="card-header bg-white p-0 border-bottom-0">
                <ul class="nav nav-tabs card-header-tabs m-0 px-3 pt-3" id="myTab" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active fw-bold" id="citas-tab" data-bs-toggle="tab" data-bs-target="#citas" type="button">
                            <i class="fas fa-history me-2"></i> Historial de Citas
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link fw-bold" id="archivos-tab" data-bs-toggle="tab" data-bs-target="#archivos" type="button">
                            <i class="fas fa-folder-open me-2"></i> Archivos / Estudios
                        </button>
                    </li>
                </ul>
            </div>
            
            <div class="card-body p-4">
                <div class="tab-content" id="myTabContent">
                    
                    <div class="tab-pane fade show active" id="citas" role="tabpanel">
                        <div class="timeline mt-4 position-relative border-start border-primary ms-3 border-2 pb-4">
                            <?php if($historial && $historial->rowCount() > 0): ?>
                                <?php while($cita = $historial->fetch(PDO::FETCH_ASSOC)): ?>
                                    <div class="mb-4 position-relative ps-4">
                                        <span class="position-absolute translate-middle-x bg-primary border border-white border-2 rounded-circle" style="left: 0; width: 16px; height: 16px; top: 4px;"></span>
                                        
                                        <div class="card shadow-sm border-0">
                                            <div class="card-body py-2 px-3 d-flex flex-wrap justify-content-between align-items-center bg-light border-bottom">
                                                <div>
                                                    <strong class="text-primary me-2"><i class="fas fa-calendar-day me-1"></i><?php echo date('d/m/Y h:i A', strtotime($cita['fecha_cita'])); ?></strong> 
                                                    <span class="fw-bold text-dark"><i class="fas fa-user-md me-1"></i>Dr(a). <?php echo htmlspecialchars($cita['medico']); ?></span> 
                                                    <small class="text-muted ms-1">(<?php echo htmlspecialchars($cita['especialidad']); ?>)</small>
                                                </div>
                                                <div class="mt-2 mt-md-0 text-end">
                                                    <?php 
                                                        $bg = match($cita['estado']) {
                                                            'Finalizada' => 'success',
                                                            'Pendiente' => 'warning',
                                                            'Cancelada' => 'danger',
                                                            default => 'secondary'
                                                        };
                                                    ?>
                                                    <span class="badge bg-<?php echo $bg; ?> me-2"><?php echo htmlspecialchars($cita['estado']); ?></span>
                                                    
                                                    <?php if($cita['estado'] == 'Finalizada' || $cita['diagnostico']): ?>
                                                        <button class="btn btn-sm btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalDetalleCita<?php echo $cita['id_cita']; ?>">
                                                            <i class="fas fa-eye"></i> Leer
                                                        </button>
                                                    <?php endif; ?>

                                                    <?php 
                                                        $fechaCita = date('Y-m-d', strtotime($cita['fecha_cita']));
                                                        $hoy = date('Y-m-d');
                                                        if($fechaCita >= $hoy && $cita['estado'] != 'Cancelada'): 
                                                    ?>
                                                        <a href="<?php echo BASE_URL; ?>/citas/atender?id=<?php echo $cita['id_cita']; ?>" target="_blank" class="btn btn-sm btn-outline-primary ms-1" title="Editar / Atender">
                                                            <i class="fas fa-edit"></i> Editar
                                                        </a>
                                                    <?php endif; ?>
                                                </div>
                                            </div>

                                            <div class="card-body">
                                                <div class="row">
                                                    <div class="col-12 mb-2">
                                                        <span class="text-secondary fw-bold small text-uppercase">Motivo:</span> 
                                                        <span class="ms-1"><?php echo htmlspecialchars($cita['motivo'] ?: 'No especificado'); ?></span>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="text-secondary fw-bold small text-uppercase"><i class="fas fa-stethoscope me-1"></i> Diagnóstico:</span><br>
                                                        <div class="p-2 bg-light rounded mt-1 border" style="min-height: 40px; font-size: 0.9rem;">
                                                            <?php echo nl2br(htmlspecialchars($cita['diagnostico'] ?: 'Sin diagnóstico')); ?>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6 mb-2">
                                                        <span class="text-secondary fw-bold small text-uppercase"><i class="fas fa-pills me-1"></i> Receta / Tratamiento:</span><br>
                                                        <div class="p-2 bg-light rounded mt-1 border" style="min-height: 40px; font-size: 0.9rem;">
                                                            <?php echo nl2br(htmlspecialchars($cita['prescripcion'] ?: 'Sin receta')); ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <?php if($cita['estado'] == 'Finalizada' || $cita['diagnostico']): ?>
                                        <div class="modal fade" id="modalDetalleCita<?php echo $cita['id_cita']; ?>" tabindex="-1">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header bg-primary text-white">
                                                        <h5 class="modal-title">Detalle de Atención</h5>
                                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="mb-3">
                                                            <h6 class="fw-bold text-primary">Motivo</h6>
                                                            <p class="bg-light p-2 rounded border"><?php echo nl2br(htmlspecialchars($cita['motivo'])); ?></p>
                                                        </div>
                                                        <div class="mb-3">
                                                            <h6 class="fw-bold text-primary">Diagnóstico</h6>
                                                            <p class="bg-light p-2 rounded border"><?php echo nl2br(htmlspecialchars($cita['diagnostico'])); ?></p>
                                                        </div>
                                                        <div class="mb-3">
                                                            <h6 class="fw-bold text-primary">Receta / Tratamiento</h6>
                                                            <p class="bg-light p-2 rounded border"><?php echo nl2br(htmlspecialchars($cita['prescripcion'])); ?></p>
                                                        </div>
                                                        <?php if($cita['dias_reposo'] > 0): ?>
                                                            <div class="alert alert-warning py-2">
                                                                <i class="fas fa-bed me-2"></i> <strong>Reposo:</strong> <?php echo $cita['dias_reposo']; ?> días
                                                            </div>
                                                        <?php endif; ?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php endif; ?>

                                    </div>
                                <?php endwhile; ?>
                            <?php else: ?>
                                <div class="text-center py-4 text-muted fst-italic w-100">
                                    <i class="fas fa-folder-open mb-2 fs-3 text-light"></i><br>
                                    Este paciente aún no tiene atenciones registradas.
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="archivos" role="tabpanel">
                        <div class="mb-4 p-3 bg-light rounded border border-dashed">
                            <form action="<?php echo BASE_URL; ?>/pacientes/subirArchivo" method="POST" enctype="multipart/form-data" class="d-flex align-items-center gap-2">
                                <input type="hidden" name="id_paciente" value="<?php echo $paciente['id_usuario']; ?>">
                                <input type="file" name="archivo" class="form-control" required>
                                <button type="submit" class="btn btn-success fw-bold text-nowrap">
                                    <i class="fas fa-upload me-2"></i> Subir
                                </button>
                            </form>
                            <small class="text-muted d-block mt-1 ms-1">* Formatos: PDF, JPG, PNG, DOC (Max 5MB)</small>
                        </div>

                        <div class="list-group">
                            <?php if(!empty($archivos)): ?>
                                <?php foreach($archivos as $archivo): ?>
                                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <?php 
                                                $icono = 'fa-file';
                                                $ext = strtolower($archivo['tipo_archivo']);
                                                if(in_array($ext, ['jpg','jpeg','png'])) $icono = 'fa-file-image text-info';
                                                elseif($ext == 'pdf') $icono = 'fa-file-pdf text-danger';
                                                elseif(in_array($ext, ['doc','docx'])) $icono = 'fa-file-word text-primary';
                                            ?>
                                            <i class="fas <?php echo $icono; ?> fa-2x me-3 opacity-75"></i>
                                            <div>
                                                <h6 class="mb-0 fw-bold"><?php echo $archivo['nombre_archivo']; ?></h6>
                                                <small class="text-muted"><?php echo date('d/m/Y H:i', strtotime($archivo['fecha_subida'])); ?></small>
                                            </div>
                                        </div>
                                        <a href="<?php echo BASE_URL . $archivo['ruta_archivo']; ?>" target="_blank" class="btn btn-sm btn-outline-dark">
                                            <i class="fas fa-download"></i> Descargar
                                        </a>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div class="text-center py-5 text-muted">
                                    <i class="fas fa-folder-open fa-3x mb-3 opacity-25"></i>
                                    <p>No hay archivos adjuntos para este paciente.</p>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>