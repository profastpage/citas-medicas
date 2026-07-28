<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <a href="<?= BASE_URL ?>/empresas" class="btn btn-sm btn-outline-secondary mb-2">
            <i class="fas fa-arrow-left me-1"></i> Volver
        </a>
        <h4 class="fw-bold mb-1"><?= htmlspecialchars($empresa['razon_social'] ?? 'Empresa') ?></h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">RUC: <?= htmlspecialchars($empresa['ruc'] ?? '-') ?></p>
    </div>
    <a href="<?= BASE_URL ?>/licencias/generar?emp=<?= $empresa['id_empresa'] ?>" class="btn btn-success rounded-pill px-4">
        <i class="fas fa-plus me-2"></i>Generar Licencia
    </a>
</div>

<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card h-100">
            <div class="card-body">
                <h6 class="text-muted mb-3"><i class="fas fa-info-circle me-2"></i>Datos de la Empresa</h6>
                <table class="table table-sm table-borderless mb-0" style="font-size:.85rem;">
                    <tr><th>Responsable:</th><td><?= htmlspecialchars($empresa['responsable'] ?? '-') ?></td></tr>
                    <tr><th>Email:</th><td><?= htmlspecialchars($empresa['email'] ?? '-') ?></td></tr>
                    <tr><th>Teléfono:</th><td><?= htmlspecialchars($empresa['telefono'] ?? '-') ?></td></tr>
                    <tr><th>Ciudad:</th><td><?= htmlspecialchars($empresa['ciudad'] ?? '-') ?></td></tr>
                    <tr><th>Dirección:</th><td><?= htmlspecialchars($empresa['direccion'] ?? '-') ?></td></tr>
                    <tr><th>Estado:</th><td><span class="badge bg-<?= $empresa['estado']=='Activo' ? 'success' : 'danger' ?>"><?= $empresa['estado'] ?></span></td></tr>
                    <tr><th>Registro:</th><td><?= date('d/m/Y', strtotime($empresa['fecha_registro'])) ?></td></tr>
                </table>
            </div>
        </div>
    </div>
    <div class="col-md-8">
        <div class="card h-100">
            <div class="card-header bg-white fw-600 py-3">
                <i class="fas fa-certificate text-primary me-2"></i>Licencias de esta Empresa
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0" style="font-size:.83rem;">
                        <thead class="table-light">
                            <tr><th>Clave (hash)</th><th>Período</th><th>Inicio</th><th>Vence</th><th>Estado</th><th>Acción</th></tr>
                        </thead>
                        <tbody>
                        <?php foreach ($licencias as $l): ?>
                            <tr>
                                <td><code style="font-size:.7rem;"><?= substr($l['clave_licencia'],0,20) ?>...</code></td>
                                <td><?= $l['cantidad_periodo'] ?> <?= $l['tipo_periodo'] ?></td>
                                <td><?= date('d/m/Y', strtotime($l['fecha_inicio'])) ?></td>
                                <td><?= date('d/m/Y', strtotime($l['fecha_fin'])) ?></td>
                                <td><span class="badge badge-<?= $l['estado'] ?>"><?= $l['estado'] ?></span></td>
                                <td>
                                    <a href="<?= BASE_URL ?>/licencias/ver?id=<?= $l['id_licencia'] ?>" class="btn btn-xs btn-info text-white btn-sm">
                                        <i class="fas fa-eye"></i>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($licencias)): ?>
                            <tr><td colspan="6" class="text-center text-muted py-3">No hay licencias para esta empresa</td></tr>
                        <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
