<?php
require_once APP_ROOT . '/views/layouts/header.php';
/**
 * Vista: Mi Licencia
 * Disponible solo para rol Administrador (rol_id = 1)
 */
$estadoClass  = $resultado['estado'] === 'Activa'  ? 'success' : ($resultado['estado'] === 'Gracia' ? 'warning' : 'danger');
$estadoIcon   = $resultado['estado'] === 'Activa'  ? 'check-circle' : ($resultado['estado'] === 'Gracia' ? 'exclamation-triangle' : 'times-circle');
$config       = $resultado['config'] ?? [];
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-key text-primary me-2"></i>Mi Licencia</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Estado y activación de la licencia del sistema</p>
    </div>
</div>

<?php if (isset($_GET['activada'])): ?>
<div class="alert alert-success alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i><?= htmlspecialchars($_SESSION['lic_mensaje'] ?? '¡Licencia activada exitosamente!') ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php unset($_SESSION['lic_mensaje']); endif; ?>

<?php if (isset($_GET['error']) && isset($_SESSION['lic_error'])): ?>
<div class="alert alert-danger alert-dismissible fade show">
    <i class="fas fa-exclamation-circle me-2"></i><?= htmlspecialchars($_SESSION['lic_error']) ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php unset($_SESSION['lic_error']); endif; ?>

<div class="row g-4">
    <!-- Estado actual -->
    <div class="col-md-5">
        <div class="card border-<?= $estadoClass ?> shadow-sm">
            <div class="card-body text-center py-4">
                <div class="mb-3">
                    <i class="fas fa-<?= $estadoIcon ?> fa-4x text-<?= $estadoClass ?>"></i>
                </div>
                <h4 class="fw-bold text-<?= $estadoClass ?>">Licencia <?= $resultado['estado'] ?></h4>
                <p class="text-muted"><?= htmlspecialchars($resultado['mensaje']) ?></p>
                <?php if ($resultado['valida'] && $resultado['dias_restantes'] > 0): ?>
                    <div class="display-6 fw-bold text-<?= $estadoClass ?>"><?= $resultado['dias_restantes'] ?></div>
                    <small class="text-muted">días restantes</small>
                <?php endif; ?>
            </div>
        </div>

        <?php if (!empty($config['clave_licencia'])): ?>
        <div class="card mt-3">
            <div class="card-header bg-white fw-600 py-3">
                <i class="fas fa-info-circle text-primary me-2"></i>Detalles de la Licencia
            </div>
            <div class="card-body">
                <table class="table table-sm table-borderless mb-0" style="font-size:.85rem;">
                    <tr><th>Empresa:</th><td><?= htmlspecialchars($config['empresa_nombre'] ?? '-') ?></td></tr>
                    <tr><th>Activada:</th><td><?= !empty($config['fecha_activacion']) ? date('d/m/Y H:i', strtotime($config['fecha_activacion'])) : '-' ?></td></tr>
                    <tr><th>Vence:</th><td class="fw-500"><?= !empty($config['fecha_vencimiento']) ? date('d/m/Y', strtotime($config['fecha_vencimiento'])) : '-' ?></td></tr>
                    <tr>
                        <th>Estado:</th>
                        <td><span class="badge bg-<?= $estadoClass ?>"><?= $resultado['estado'] ?></span></td>
                    </tr>
                </table>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <!-- Formularios de Activación -->
    <div class="col-md-7">
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white py-3">
                <i class="fas fa-unlock me-2"></i>Activar / Renovar Licencia
            </div>
            <div class="card-body">
                
                <!-- Formulario Manual (Offline) -->
                <div>
                        <p class="text-muted mb-3" style="font-size:.85rem;">
                            Utiliza esta opción si no tienes conexión a internet. Ingresa los datos completos proporcionados por el proveedor.
                        </p>
                        <form action="<?= BASE_URL ?>/licencia/activar" method="POST">
                            <div class="mb-3">
                                <label class="form-label fw-500">N° ID de Empresa <span class="text-danger">*</span></label>
                                <input type="number" name="id_empresa" class="form-control" min="1" required
                                       placeholder="Número asignado por el proveedor">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-500">RUC de la Empresa <span class="text-danger">*</span></label>
                                <input type="text" name="ruc_empresa" class="form-control" maxlength="20" required
                                       placeholder="20123456789">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-500">Nombre de la Empresa</label>
                                <input type="text" name="empresa_nombre" class="form-control"
                                       placeholder="Razón Social o nombre comercial">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-500">Fecha de Vencimiento <span class="text-danger">*</span></label>
                                <input type="date" name="fecha_vencimiento" class="form-control" required>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-500">Clave de Licencia <span class="text-danger">*</span></label>
                                <textarea name="clave_licencia" class="form-control font-monospace" rows="3" required
                                          placeholder="Pegue aquí la clave de 64 caracteres proporcionada por el proveedor..."
                                          style="font-size:.8rem;"></textarea>
                            </div>
                            <button type="submit" class="btn btn-secondary w-100">
                                <i class="fas fa-key me-2"></i>Activar Manualmente
                            </button>
                        </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
