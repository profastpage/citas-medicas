<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-file-invoice-dollar text-success me-2"></i>Control de Pagos</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Historial de cobros por licencias</p>
    </div>
</div>

<?php
$totalPagado = array_sum(array_map(fn($p) => $p['estado_pago']==='Pagado' ? $p['monto'] : 0, $pagos));
$totalPendiente = array_sum(array_map(fn($p) => $p['estado_pago']==='Pendiente' ? $p['monto'] : 0, $pagos));
?>

<div class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#10b981,#059669);">
            <div class="stat-label">Total Cobrado</div>
            <div class="stat-value"><?= $SIM ?> <?= number_format($totalPagado,2) ?></div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#f59e0b,#d97706);">
            <div class="stat-label">Pendiente de Cobro</div>
            <div class="stat-value"><?= $SIM ?> <?= number_format($totalPendiente,2) ?></div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="stat-card" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">
            <div class="stat-label">Total Registros</div>
            <div class="stat-value"><?= count($pagos) ?></div>
        </div>
    </div>
</div>

<?php if (isset($_GET['ok'])): ?>
<div class="alert alert-<?= $_GET['ok']==='anulado' ? 'warning' : 'success' ?> alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>
    <?= $_GET['ok']==='anulado' ? 'Pago anulado.' : 'Pago registrado exitosamente.' ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover datatable" style="font-size:.85rem;">
                <thead class="table-light">
                    <tr><th>#</th><th>Empresa</th><th>Tipo Lic.</th><th>Vence</th><th>Monto</th><th>Método</th><th>Referencia</th><th>Fecha Pago</th><th>Estado</th><th>Acc.</th></tr>
                </thead>
                <tbody>
                <?php foreach ($pagos as $p): ?>
                    <tr>
                        <td><?= $p['id_pago'] ?></td>
                        <td class="fw-500"><?= htmlspecialchars($p['razon_social']) ?></td>
                        <td><?= ucfirst($p['tipo_periodo']) ?></td>
                        <td><?= date('d/m/Y', strtotime($p['fecha_fin'])) ?></td>
                        <td class="fw-600 text-success"><?= $SIM ?> <?= number_format($p['monto'],2) ?></td>
                        <td><?= htmlspecialchars($p['metodo_pago'] ?? '-') ?></td>
                        <td><code><?= htmlspecialchars($p['referencia'] ?? '-') ?></code></td>
                        <td><?= date('d/m/Y H:i', strtotime($p['fecha_pago'])) ?></td>
                        <td><span class="badge badge-<?= $p['estado_pago'] ?>"><?= $p['estado_pago'] ?></span></td>
                        <td>
                            <?php if ($p['estado_pago'] !== 'Anulado'): ?>
                            <a href="<?= BASE_URL ?>/pagos/anular?id=<?= $p['id_pago'] ?>"
                               class="btn btn-sm btn-outline-danger"
                               onclick="return confirm('¿Anular este pago?')">
                                <i class="fas fa-times"></i>
                            </a>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>

                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
