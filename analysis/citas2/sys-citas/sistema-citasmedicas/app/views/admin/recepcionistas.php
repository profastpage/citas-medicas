<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="text-secondary fw-bold">Gestión de Recepcionistas</h2>
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalRecepcionista">
        <i class="fas fa-plus me-2"></i> Nuevo Recepcionista
    </button>
</div>

<div class="card shadow border-0">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="tablaRecepcionistas" width="100%">
                <thead class="bg-light">
                    <tr>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $recepcionistas->fetch(PDO::FETCH_ASSOC)): ?>
                        <?php 
                            // Sanitización de datos
                            $id_usuario = $row['id_usuario'];
                            $nombre = htmlspecialchars($row['nombre'] ?? '', ENT_QUOTES);
                            $email = htmlspecialchars($row['email'] ?? '', ENT_QUOTES);
                            $telefono = htmlspecialchars($row['telefono'] ?? '', ENT_QUOTES);

                            // Estado
                            $estado = isset($row['estado']) ? (int)$row['estado'] : 1;
                            $badgeClase = $estado == 1 ? 'bg-success' : 'bg-secondary';
                            $textoEstado = $estado == 1 ? 'Activo' : 'Inactivo';
                            $filaClase = $estado == 1 ? '' : 'bg-light text-muted opacity-75';
                            
                            // Botón Toggle
                            $btnIcono = $estado == 1 ? 'fa-toggle-on' : 'fa-toggle-off';
                            $btnColor = $estado == 1 ? 'text-success' : 'text-secondary';
                            $btnTitulo = $estado == 1 ? 'Desactivar' : 'Activar';
                        ?>
                        <tr class="<?php echo $filaClase; ?>">
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="bg-success bg-opacity-10 text-success rounded-circle p-2 me-2">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <span class="fw-bold"><?php echo $nombre; ?></span>
                                </div>
                            </td>
                            <td>
                                <div class="small text-muted"><i class="fas fa-envelope me-1"></i> <?php echo $email; ?></div>
                                <?php if($telefono): ?>
                                    <div class="small text-secondary"><i class="fas fa-phone me-1"></i> <?php echo $telefono; ?></div>
                                <?php endif; ?>
                            </td>
                            <td><span class="badge <?php echo $badgeClase; ?>"><?php echo $textoEstado; ?></span></td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-primary me-1" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalEditar"
                                        
                                        data-idusuario="<?php echo $id_usuario; ?>"
                                        data-nombre="<?php echo $nombre; ?>"
                                        data-email="<?php echo $email; ?>"
                                        data-telefono="<?php echo $telefono; ?>"
                                        
                                        onclick="llenarModalEditar(this)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                
                                <button class="btn btn-sm btn-light border-0 fs-5 <?php echo $btnColor; ?>" 
                                        title="<?php echo $btnTitulo; ?>"
                                        onclick="cambiarEstado(<?php echo $id_usuario; ?>, <?php echo $estado; ?>)">
                                    <i class="fas <?php echo $btnIcono; ?>"></i>
                                </button>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- MODAL CREAR -->
<div class="modal fade" id="modalRecepcionista" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-success text-white">
                <h5 class="modal-title">Registrar Nuevo Recepcionista</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form action="<?php echo BASE_URL; ?>/recepcionistas/guardar" method="POST">
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Nombre Completo</label>
                        <input type="text" name="nombre" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Teléfono</label>
                        <input type="text" name="telefono" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn btn-success">Guardar</button></div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL EDITAR -->
<div class="modal fade" id="modalEditar" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">Editar Recepcionista</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form action="<?php echo BASE_URL; ?>/recepcionistas/actualizar" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="id_usuario" id="edit_id_usuario">
                    
                    <div class="mb-3">
                        <label class="form-label">Nombre Completo</label>
                        <input type="text" name="nombre" id="edit_nombre" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" name="email" id="edit_email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Teléfono</label>
                        <input type="text" name="telefono" id="edit_telefono" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nueva Contraseña</label>
                        <input type="password" name="password" class="form-control" placeholder="Dejar en blanco para mantener">
                    </div>
                </div>
                <div class="modal-footer"><button type="submit" class="btn btn-primary">Actualizar</button></div>
            </form>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>

<script>
    $(document).ready(function() {
        if ($.fn.DataTable.isDataTable('#tablaRecepcionistas')) {
            $('#tablaRecepcionistas').DataTable().destroy();
        }
        $('#tablaRecepcionistas').DataTable({
            responsive: true,
            searching: true,
            dom: 'Bfrtip',
            buttons: ['excel', 'pdf', 'print'],
            language: { url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' }
        });
    });

    // LLENAR EL MODAL DE EDICIÓN
    function llenarModalEditar(btn) {
        document.getElementById('edit_id_usuario').value = btn.getAttribute('data-idusuario');
        document.getElementById('edit_nombre').value = btn.getAttribute('data-nombre');
        document.getElementById('edit_email').value = btn.getAttribute('data-email');
        document.getElementById('edit_telefono').value = btn.getAttribute('data-telefono');
    }

    // ACTIVAR / DESACTIVAR
    function cambiarEstado(id, estadoActual) {
        let accion = (estadoActual == 1) ? "desactivar" : "activar";
        let colorBtn = (estadoActual == 1) ? '#d33' : '#198754';
        
        Swal.fire({
            title: '¿' + accion.charAt(0).toUpperCase() + accion.slice(1) + ' Recepcionista?',
            text: "El recepcionista perderá o recuperará el acceso al sistema.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: colorBtn,
            confirmButtonText: 'Sí, ' + accion,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "<?php echo BASE_URL; ?>/recepcionistas/cambiarEstado?id=" + id + "&estado=" + estadoActual;
            }
        });
    }

    // Alertas
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if(msg) {
        let title = 'Acción', icon = 'info', text = 'Realizado';
        if(msg === 'creado') { title = '¡Registrado!'; icon = 'success'; text = 'Recepcionista agregado.'; }
        else if(msg === 'actualizado') { title = '¡Actualizado!'; icon = 'success'; text = 'Datos guardados.'; }
        else if(msg === 'activado') { title = 'Activado'; icon = 'success'; text = 'Acceso habilitado.'; }
        else if(msg === 'desactivado') { title = 'Desactivado'; icon = 'warning'; text = 'Acceso inhabilitado.'; }
        else if(msg === 'error_email') { title = 'Error'; icon = 'error'; text = 'El correo ya está en uso por otro usuario.'; }
        else if(msg === 'error') { title = 'Error'; icon = 'error'; text = 'Ocurrió un problema.'; }
        
        Swal.fire({ title: title, text: text, icon: icon, confirmButtonColor: '#0d6efd' })
            .then(() => window.history.replaceState({}, document.title, window.location.pathname));
    }
</script>
