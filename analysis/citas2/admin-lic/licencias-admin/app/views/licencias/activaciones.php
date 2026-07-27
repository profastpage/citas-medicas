<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-history text-info me-2"></i>Historial de Activaciones</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Registro de todas las activaciones de licencias</p>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover datatable" style="font-size:.85rem;">
                <thead class="table-light">
                    <tr><th>#</th><th>Empresa</th><th>Fecha Activación</th><th>IP</th><th>Servidor</th><th>Observación</th></tr>
                </thead>
                <tbody>
                <?php foreach ($activaciones as $i => $a): ?>
                    <tr>
                        <td><?= $i+1 ?></td>
                        <td class="fw-500"><?= htmlspecialchars($a['razon_social']) ?></td>
                        <td><?= date('d/m/Y H:i:s', strtotime($a['fecha_activacion'])) ?></td>
                        <td><code><?= htmlspecialchars($a['ip_activacion'] ?? '-') ?></code></td>
                        <td style="font-size:.75rem;"><?= htmlspecialchars($a['servidor_info'] ?? '-') ?></td>
                        <td><?= htmlspecialchars($a['observacion'] ?? '-') ?></td>
                    </tr>
                <?php endforeach; ?>

                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
