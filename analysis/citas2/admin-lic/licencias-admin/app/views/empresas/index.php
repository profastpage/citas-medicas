<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-building text-primary me-2"></i>Empresas / EESS</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Clientes registrados en el sistema de licenciamiento</p>
    </div>
    <button class="btn btn-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#modalCrearEmpresa">
        <i class="fas fa-plus me-2"></i>Nueva Empresa
    </button>
</div>

<?php if (isset($_GET['ok'])): ?>
<div class="alert alert-success alert-dismissible fade show" role="alert">
    <i class="fas fa-check-circle me-2"></i>
    <?= $_GET['ok']==1 ? 'Empresa creada correctamente.' : ($_GET['ok']==2 ? 'Empresa actualizada.' : 'Empresa eliminada.') ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover datatable" style="font-size:.85rem;">
                <thead class="table-light">
                    <tr>
                        <th>#</th><th>Razón Social</th><th>RUC</th><th>Responsable</th>
                        <th>Email</th><th>Licencias</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($empresas as $e): ?>
                    <tr>
                        <td><?= $e['id_empresa'] ?></td>
                        <td class="fw-500"><?= htmlspecialchars($e['razon_social']) ?></td>
                        <td><code><?= htmlspecialchars($e['ruc'] ?? '-') ?></code></td>
                        <td><?= htmlspecialchars($e['responsable'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($e['email'] ?? '-') ?></td>
                        <td>
                            <span class="badge bg-primary"><?= $e['total_licencias'] ?> total</span>
                            <?php if ($e['licencias_activas']>0): ?>
                            <span class="badge badge-Activa"><?= $e['licencias_activas'] ?> activas</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <span class="badge <?= $e['estado']=='Activo' ? 'bg-success' : 'bg-danger' ?>">
                                <?= $e['estado'] ?>
                            </span>
                        </td>
                        <td>
                            <a href="<?= BASE_URL ?>/empresas/ver?id=<?= $e['id_empresa'] ?>" class="btn btn-sm btn-info text-white" title="Ver detalle">
                                <i class="fas fa-eye"></i>
                            </a>
                            <button class="btn btn-sm btn-warning" title="Editar"
                                onclick="editarEmpresa(<?= htmlspecialchars(json_encode($e)) ?>)">
                                <i class="fas fa-edit"></i>
                            </button>
                            <a href="<?= BASE_URL ?>/empresas/eliminar?id=<?= $e['id_empresa'] ?>"
                               class="btn btn-sm btn-danger"
                               onclick="return confirm('¿Eliminar esta empresa y todas sus licencias?')">
                                <i class="fas fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- MODAL CREAR -->
<div class="modal fade" id="modalCrearEmpresa" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
            <form action="<?= BASE_URL ?>/empresas/guardar" method="POST">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-building me-2"></i>Nueva Empresa</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-500">Razón Social <span class="text-danger">*</span></label>
                            <input type="text" name="razon_social" class="form-control" required placeholder="Ej: Clínica San Lucas S.A.C.">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-500">RUC</label>
                            <input type="text" name="ruc" class="form-control" placeholder="20123456789" maxlength="11">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Nombre Comercial</label>
                            <input type="text" name="nombre_comercial" class="form-control" placeholder="Ej: Clínica San Lucas">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Responsable</label>
                            <input type="text" name="responsable" class="form-control" placeholder="Nombre del responsable">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Email</label>
                            <input type="email" name="email" class="form-control" placeholder="contacto@empresa.com">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-500">Teléfono</label>
                            <input type="text" name="telefono" class="form-control" placeholder="999-888-777">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-500">Ciudad</label>
                            <input type="text" name="ciudad" class="form-control" placeholder="Lima">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-500">Dirección</label>
                            <input type="text" name="direccion" class="form-control" placeholder="Av. Principal 123...">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-500">Notas</label>
                            <textarea name="notas" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save me-2"></i>Guardar Empresa</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- MODAL EDITAR -->
<div class="modal fade" id="modalEditarEmpresa" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content border-0 shadow">
            <form action="<?= BASE_URL ?>/empresas/actualizar" method="POST">
                <div class="modal-header bg-warning">
                    <h5 class="modal-title"><i class="fas fa-edit me-2"></i>Editar Empresa</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="id_empresa" id="edit_id_empresa">
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-500">Razón Social <span class="text-danger">*</span></label>
                            <input type="text" name="razon_social" id="edit_razon_social" class="form-control" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-500">RUC</label>
                            <input type="text" name="ruc" id="edit_ruc" class="form-control" maxlength="11">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Nombre Comercial</label>
                            <input type="text" name="nombre_comercial" id="edit_nombre_comercial" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Responsable</label>
                            <input type="text" name="responsable" id="edit_responsable" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Email</label>
                            <input type="email" name="email" id="edit_email" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-500">Teléfono</label>
                            <input type="text" name="telefono" id="edit_telefono" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-500">Estado</label>
                            <select name="estado" id="edit_estado" class="form-select">
                                <option value="Activo">Activo</option>
                                <option value="Suspendido">Suspendido</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-500">Dirección</label>
                            <input type="text" name="direccion" id="edit_direccion" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Ciudad</label>
                            <input type="text" name="ciudad" id="edit_ciudad" class="form-control">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-500">Notas</label>
                            <textarea name="notas" id="edit_notas" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" class="btn btn-warning"><i class="fas fa-save me-2"></i>Actualizar</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function editarEmpresa(emp) {
    document.getElementById('edit_id_empresa').value       = emp.id_empresa;
    document.getElementById('edit_razon_social').value     = emp.razon_social;
    document.getElementById('edit_ruc').value              = emp.ruc || '';
    document.getElementById('edit_nombre_comercial').value = emp.nombre_comercial || '';
    document.getElementById('edit_responsable').value      = emp.responsable || '';
    document.getElementById('edit_email').value            = emp.email || '';
    document.getElementById('edit_telefono').value         = emp.telefono || '';
    document.getElementById('edit_direccion').value        = emp.direccion || '';
    document.getElementById('edit_ciudad').value           = emp.ciudad || '';
    document.getElementById('edit_estado').value           = emp.estado;
    document.getElementById('edit_notas').value            = emp.notas || '';
    new bootstrap.Modal(document.getElementById('modalEditarEmpresa')).show();
}
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
