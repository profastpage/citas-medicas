<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold text-secondary">Directorio de Pacientes</h2>
    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPaciente">
        <i class="fas fa-user-plus me-2"></i> Nuevo Paciente
    </button>
</div>

<div class="card shadow border-0">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="tablaPacientes" width="100%">
                <thead class="bg-light">
                    <tr>
                        <th>Nombre / DNI</th>
                        <th>Contacto</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($pacientes): ?>
                    <?php while($row = $pacientes->fetch(PDO::FETCH_ASSOC)): ?>
                        <?php 
                            $id = $row['id_usuario'];
                            $nombre = htmlspecialchars($row['nombre']);
                            $dni = htmlspecialchars($row['documento_identidad'] ?? '');
                            $email = htmlspecialchars($row['email']);
                            $telefono = htmlspecialchars($row['telefono'] ?? '');
                            $sangre = htmlspecialchars($row['grupo_sanguineo'] ?? '');
                            $alergias = htmlspecialchars($row['alergias'] ?? '');
                            $cronicas = htmlspecialchars($row['enfermedades_cronicas'] ?? '');
                            
                            // Nuevos campos
                            $fnac = htmlspecialchars($row['fecha_nacimiento'] ?? '');
                            $sexo = htmlspecialchars($row['sexo'] ?? '');
                            $resp = htmlspecialchars($row['persona_responsable'] ?? '');
                            $tel_resp = htmlspecialchars($row['tel_responsable'] ?? '');
                            $hxc = htmlspecialchars($row['nro_historia_clinica'] ?? '');
                            
                            $fecha = date('d/m/Y', strtotime($row['fecha_creacion']));
                            
                            $estado = $row['estado'];
                            $btnClase = $estado == 1 ? 'text-success' : 'text-secondary';
                            $btnIcono = $estado == 1 ? 'fa-toggle-on' : 'fa-toggle-off';
                        ?>
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="bg-light rounded-circle p-2 me-3 text-primary">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold"><?php echo $nombre; ?></div>
                                        <small class="text-muted">DNI: <?php echo $dni; ?></small>
                                        <?php if($hxc): ?><br><small class="text-primary fw-bold" style="font-size: 0.75rem;">H.C. N° <?php echo $hxc; ?></small><?php endif; ?>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="small"><i class="fas fa-envelope me-1 text-muted"></i> <?php echo $email; ?></div>
                                <div class="small"><i class="fas fa-phone me-1 text-muted"></i> <?php echo $telefono; ?></div>
                            </td>
                            <td><span class="badge bg-light text-dark border"><?php echo $fecha; ?></span></td>
                            <td>
                                <a href="<?php echo BASE_URL; ?>/pacientes/historial?id=<?php echo $id; ?>" class="btn btn-sm btn-info text-white me-1" title="Historia Clínica">
                                    <i class="fas fa-file-medical-alt"></i>
                                </a>
                                
                                <button class="btn btn-sm btn-outline-primary me-1" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalEditar"
                                        
                                        data-id="<?php echo $id; ?>"
                                        data-nombre="<?php echo $nombre; ?>"
                                        data-dni="<?php echo $dni; ?>"
                                        data-email="<?php echo $email; ?>"
                                        data-telefono="<?php echo $telefono; ?>"
                                        data-sangre="<?php echo $sangre; ?>"
                                        data-alergias="<?php echo $alergias; ?>"
                                        data-cronicas="<?php echo $cronicas; ?>"
                                        
                                        data-fnac="<?php echo $fnac; ?>"
                                        data-sexo="<?php echo $sexo; ?>"
                                        data-resp="<?php echo $resp; ?>"
                                        data-telresp="<?php echo $tel_resp; ?>"
                                        data-hxc="<?php echo $hxc; ?>"
                                        
                                        onclick="llenarModalEditar(this)">
                                    <i class="fas fa-edit"></i>
                                </button>

                                <button class="btn btn-sm btn-light border-0 fs-5 <?php echo $btnClase; ?>" 
                                        onclick="cambiarEstado(<?php echo $id; ?>, <?php echo $estado; ?>)">
                                    <i class="fas <?php echo $btnIcono; ?>"></i>
                                </button>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="modalPaciente" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">Registrar Nuevo Paciente</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form action="<?php echo BASE_URL; ?>/pacientes/guardar" method="POST">
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Nombre Completo</label>
                            <input type="text" name="nombre" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">DNI / Documento</label>
                            <input type="text" name="documento_identidad" class="form-control" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <input type="text" name="telefono" class="form-control">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Alergias</label>
                        <input type="text" name="alergias" class="form-control" placeholder="Ninguna">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Enfermedades Crónicas</label>
                        <textarea name="enfermedades_cronicas" class="form-control" rows="2" placeholder="Ninguna"></textarea>
                    </div>

                    <hr class="my-4 text-secondary">
                    <h6 class="fw-bold text-primary mb-3"><i class="fas fa-info-circle me-1"></i> Datos Demográficos e Hx Clínica (Opcionales)</h6>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Fecha Nacimiento</label>
                            <input type="date" name="fecha_nacimiento" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Sexo</label>
                            <select name="sexo" class="form-select">
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">N° Hx Clínica</label>
                            <input type="text" name="nro_historia_clinica" class="form-control" placeholder="Ej: 001234">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-7">
                            <label class="form-label">Persona Responsable</label>
                            <input type="text" name="persona_responsable" class="form-control" placeholder="En caso de emergencia o menor">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label">Tel. Responsable</label>
                            <input type="text" name="tel_responsable" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-warning text-dark">
                <h5 class="modal-title">Editar Paciente</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="<?php echo BASE_URL; ?>/pacientes/actualizar" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="id_usuario" id="edit_id">

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Nombre</label>
                            <input type="text" name="nombre" id="edit_nombre" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">DNI</label>
                            <input type="text" name="documento_identidad" id="edit_dni" class="form-control" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Teléfono</label>
                            <input type="text" name="telefono" id="edit_telefono" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" id="edit_email" class="form-control" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Alergias</label>
                        <input type="text" name="alergias" id="edit_alergias" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Enfermedades Crónicas</label>
                        <textarea name="enfermedades_cronicas" id="edit_cronicas" class="form-control" rows="2"></textarea>
                    </div>

                    <hr class="my-4 text-warning">
                    <h6 class="fw-bold text-dark mb-3"><i class="fas fa-info-circle me-1"></i> Datos Demográficos e Hx Clínica</h6>
                    
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label class="form-label">Fecha Nacimiento</label>
                            <input type="date" name="fecha_nacimiento" id="edit_fnac" class="form-control">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Sexo</label>
                            <select name="sexo" id="edit_sexo" class="form-select">
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">N° Hx Clínica</label>
                            <input type="text" name="nro_historia_clinica" id="edit_hxc" class="form-control">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-7">
                            <label class="form-label">Persona Responsable</label>
                            <input type="text" name="persona_responsable" id="edit_resp" class="form-control">
                        </div>
                        <div class="col-md-5">
                            <label class="form-label">Tel. Responsable</label>
                            <input type="text" name="tel_responsable" id="edit_telresp" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-warning">Actualizar Datos</button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>

<script>
    $(document).ready(function() {
        if ($.fn.DataTable.isDataTable('#tablaPacientes')) {
            $('#tablaPacientes').DataTable().destroy();
        }
        $('#tablaPacientes').DataTable({
            responsive: true,
            language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
            order: [[ 0, "asc" ]]
        });
    });

    function llenarModalEditar(btn) {
        const id = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        const dni = btn.getAttribute('data-dni');
        const email = btn.getAttribute('data-email');
        const telefono = btn.getAttribute('data-telefono');
        const sangre = btn.getAttribute('data-sangre');
        const alergias = btn.getAttribute('data-alergias');
        const cronicas = btn.getAttribute('data-cronicas');
        
        const fnac = btn.getAttribute('data-fnac');
        const sexo = btn.getAttribute('data-sexo');
        const resp = btn.getAttribute('data-resp');
        const telresp = btn.getAttribute('data-telresp');
        const hxc = btn.getAttribute('data-hxc');

        document.getElementById('edit_id').value = id;
        document.getElementById('edit_nombre').value = nombre;
        document.getElementById('edit_dni').value = dni;
        document.getElementById('edit_email').value = email;
        document.getElementById('edit_telefono').value = telefono;
        document.getElementById('edit_sangre').value = sangre;
        document.getElementById('edit_alergias').value = alergias;
        document.getElementById('edit_cronicas').value = cronicas;
        
        document.getElementById('edit_fnac').value = fnac;
        document.getElementById('edit_sexo').value = sexo;
        document.getElementById('edit_resp').value = resp;
        document.getElementById('edit_telresp').value = telresp;
        document.getElementById('edit_hxc').value = hxc;
    }

    function cambiarEstado(id, estadoActual) {
        let nuevoEstado = estadoActual == 1 ? 0 : 1;
        window.location.href = `<?php echo BASE_URL; ?>/pacientes/cambiarEstado?id=${id}&estado=${estadoActual}`;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg) {
        let text = 'Operación Exitosa';
        let icon = 'success';
        if(msg === 'creado') text = 'Paciente registrado correctamente.';
        else if(msg === 'actualizado') text = 'Datos del paciente actualizados.';
        else if(msg === 'error') { text = 'Ocurrió un error. Verifique los datos.'; icon = 'error'; }
        
        Swal.fire({ title: 'Pacientes', text: text, icon: icon, confirmButtonColor: '#0d6efd' })
            .then(() => window.history.replaceState({}, document.title, window.location.pathname));
    }
</script>