<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1">Dashboard</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Resumen del sistema de licenciamiento</p>
    </div>
    <a href="<?= BASE_URL ?>/licencias/generar" class="btn btn-primary rounded-pill px-4">
        <i class="fas fa-plus me-2"></i>Nueva Licencia
    </a>
</div>

<!-- STAT CARDS -->
<div class="row g-3 mb-4">
    <div class="col-6 col-lg-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="stat-label">Empresas Activas</div>
                <div class="stat-icon"><i class="fas fa-building"></i></div>
            </div>
            <div class="stat-value"><?= $metrics['total_empresas'] ?></div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#10b981,#059669);">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="stat-label">Licencias Activas</div>
                <div class="stat-icon"><i class="fas fa-certificate"></i></div>
            </div>
            <div class="stat-value"><?= $metrics['licencias_activas'] ?></div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#f59e0b,#d97706);">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="stat-label">Por Vencer (30d)</div>
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
            </div>
            <div class="stat-value"><?= $metrics['licencias_por_vencer'] ?></div>
        </div>
    </div>
    <div class="col-6 col-lg-3">
        <div class="stat-card" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="stat-label">Ingresos del Mes</div>
                <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
            </div>
            <div class="stat-value" style="font-size:1.5rem;">S/ <?= number_format($metrics['ingresos_mes'],2) ?></div>
        </div>
    </div>
</div>

<!-- TABLES -->
<div class="row g-3">
    <div class="col-lg-7">
        <div class="card">
            <div class="card-header bg-white fw-600 d-flex justify-content-between align-items-center py-3">
                <span><i class="fas fa-certificate text-primary me-2"></i>Últimas Licencias</span>
                <a href="<?= BASE_URL ?>/licencias" class="btn btn-sm btn-outline-primary rounded-pill">Ver todas</a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0" style="font-size:.85rem;">
                        <thead class="table-light"><tr>
                            <th>Empresa</th><th>Tipo</th><th>Vence</th><th>Estado</th>
                        </tr></thead>
                        <tbody>
                        <?php foreach ($metrics['licencias_recientes'] as $l): ?>
                            <tr>
                                <td><?= htmlspecialchars($l['razon_social']) ?></td>
                                <td><?= ucfirst($l['tipo_periodo']) ?></td>
                                <td><?= date('d/m/Y', strtotime($l['fecha_fin'])) ?></td>
                                <td><span class="badge badge-<?= $l['estado'] ?>"><?= $l['estado'] ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($metrics['licencias_recientes'])): ?>
                            <tr><td colspan="4" class="text-center text-muted py-4">No hay licencias registradas</td></tr>
                        <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="card h-100">
            <div class="card-header bg-white fw-600 d-flex justify-content-between align-items-center py-3">
                <span><i class="fas fa-history text-success me-2"></i>Últimas Activaciones</span>
                <a href="<?= BASE_URL ?>/licencias/activaciones" class="btn btn-sm btn-outline-success rounded-pill">Ver todo</a>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0" style="font-size:.85rem;">
                        <thead class="table-light"><tr><th>Empresa</th><th>Fecha</th><th>IP</th></tr></thead>
                        <tbody>
                        <?php foreach ($metrics['ultimas_activaciones'] as $a): ?>
                            <tr>
                                <td><?= htmlspecialchars($a['razon_social']) ?></td>
                                <td><?= date('d/m/y H:i', strtotime($a['fecha_activacion'])) ?></td>
                                <td><code style="font-size:.75rem;"><?= htmlspecialchars($a['ip_activacion'] ?? '-') ?></code></td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($metrics['ultimas_activaciones'])): ?>
                            <tr><td colspan="3" class="text-center text-muted py-4">Sin activaciones aún</td></tr>
                        <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
