<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<a href="<?= BASE_URL ?>/licencias" class="btn btn-sm btn-outline-secondary mb-3">
    <i class="fas fa-arrow-left me-1"></i> Volver a Licencias
</a>

<?php if (isset($_GET['ok']) && $_GET['ok'] === '1'): ?>
<div class="alert alert-success alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>Licencia generada correctamente.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<?php if (isset($_GET['ok']) && $_GET['ok'] === 'activada'): ?>
<div class="alert alert-success alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>¡Licencia marcada como <strong>Activa</strong> y activación registrada en el historial.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<?php if (!$licencia): ?>
<div class="alert alert-danger">Licencia no encontrada.</div>
<?php else: ?>
<div class="row g-3">
    <!-- Datos de la Licencia -->
    <div class="col-md-5">
        <div class="card">
            <div class="card-header bg-primary text-white py-3">
                <i class="fas fa-certificate me-2"></i>Detalles de la Licencia
            </div>
            <div class="card-body">
                <table class="table table-sm table-borderless mb-0" style="font-size:.85rem;">
                    <tr><th>Empresa:</th><td class="fw-500"><?= htmlspecialchars($licencia['razon_social']) ?></td></tr>
                    <tr><th>RUC:</th><td><code><?= htmlspecialchars($licencia['ruc'] ?? '-') ?></code></td></tr>
                    <tr><th>Período:</th><td><?= $licencia['cantidad_periodo'] ?> <?= ucfirst($licencia['tipo_periodo']) ?></td></tr>
                    <tr><th>Inicio:</th><td><?= date('d/m/Y', strtotime($licencia['fecha_inicio'])) ?></td></tr>
                    <tr><th>Vencimiento:</th><td><?= date('d/m/Y', strtotime($licencia['fecha_fin'])) ?></td></tr>
                    <tr><th>Precio:</th><td><?= $SIM ?> <?= number_format($licencia['precio'], 2) ?></td></tr>
                    <tr><th>Estado:</th><td><span class="badge badge-<?= $licencia['estado'] ?>"><?= $licencia['estado'] ?></span></td></tr>
                </table>
                <hr>
                <div class="mb-2"><strong>Clave de Licencia:</strong></div>
                <div class="bg-dark text-success p-3 rounded" style="font-family:monospace;font-size:.75rem;word-break:break-all;">
                    <?= htmlspecialchars($licencia['clave_licencia']) ?>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="copiarClave('<?= $licencia['clave_licencia'] ?>')">
                        <i class="fas fa-copy me-1"></i>Copiar Clave
                    </button>
                    <?php if ($licencia['estado'] !== 'Revocada'): ?>
                    <a href="<?= BASE_URL ?>/licencias/revocar?id=<?= $licencia['id_licencia'] ?>"
                       class="btn btn-sm btn-outline-danger"
                       onclick="return confirm('¿Revocar esta licencia?')">
                        <i class="fas fa-ban me-1"></i>Revocar
                    </a>
                    <?php endif; ?>
                    <?php if (in_array($licencia['estado'], ['Activa', 'Pendiente'])): ?>
                    <a href="<?= BASE_URL ?>/licencias/suspender?id=<?= $licencia['id_licencia'] ?>&back=<?= urlencode(BASE_URL . '/licencias/ver?id=' . $licencia['id_licencia']) ?>"
                       class="btn btn-sm btn-outline-warning"
                       onclick="return confirm('¿Pausar esta licencia temporalmente?')">
                        <i class="fas fa-pause me-1"></i>Pausar
                    </a>
                    <?php elseif ($licencia['estado'] === 'Suspendida'): ?>
                    <a href="<?= BASE_URL ?>/licencias/reactivar?id=<?= $licencia['id_licencia'] ?>&back=<?= urlencode(BASE_URL . '/licencias/ver?id=' . $licencia['id_licencia']) ?>"
                       class="btn btn-sm btn-outline-success"
                       onclick="return confirm('¿Reanudar esta licencia?')">
                        <i class="fas fa-play me-1"></i>Reanudar
                    </a>
                    <?php endif; ?>
                    <?php if ($licencia['estado'] === 'Pendiente'): ?>
                    <a href="<?= BASE_URL ?>/licencias/marcarActivada?id=<?= $licencia['id_licencia'] ?>"
                       class="btn btn-sm btn-success"
                       onclick="return confirm('¿Marcar esta licencia como Activa? Se registrará una activación manual en el historial.')">
                        <i class="fas fa-check-circle me-1"></i>Marcar como Activa
                    </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Registrar Pago -->
        <div class="card mt-3">
            <div class="card-header bg-success text-white py-3">
                <i class="fas fa-file-invoice-dollar me-2"></i>Registrar Pago
            </div>
            <div class="card-body">
                <form action="<?= BASE_URL ?>/pagos/registrar" method="POST">
                    <input type="hidden" name="id_licencia" value="<?= $licencia['id_licencia'] ?>">
                    <input type="hidden" name="back" value="<?= BASE_URL ?>/licencias/ver?id=<?= $licencia['id_licencia'] ?>">
                    <div class="mb-2">
                        <label class="form-label form-label-sm">Monto (S/)</label>
                        <input type="number" name="monto" class="form-control form-control-sm" step="0.01"
                               value="<?= $licencia['precio'] ?>" required>
                    </div>
                    <div class="row g-2 mb-2">
                        <div class="col-6">
                            <label class="form-label form-label-sm">Método</label>
                            <select name="metodo_pago" class="form-select form-select-sm">
                                <option>Efectivo</option><option>Transferencia</option>
                                <option>Yape</option><option>Plin</option><option>Tarjeta</option><option>Otro</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label form-label-sm">Estado</label>
                            <select name="estado_pago" class="form-select form-select-sm">
                                <option value="Pagado">Pagado</option>
                                <option value="Pendiente">Pendiente</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-label form-label-sm">N° Referencia / Comprobante</label>
                        <input type="text" name="referencia" class="form-control form-control-sm" placeholder="Opcional">
                    </div>
                    <div class="mb-2">
                        <label class="form-label form-label-sm">Observaciones</label>
                        <textarea name="observaciones" class="form-control form-control-sm" rows="2"></textarea>
                    </div>
                    <button type="submit" class="btn btn-success btn-sm w-100">
                        <i class="fas fa-save me-1"></i>Registrar Pago
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Activaciones y Pagos -->
    <div class="col-md-7">
        <!-- Historial de Activaciones -->
        <div class="card mb-3">
            <div class="card-header py-3 bg-white fw-600">
                <i class="fas fa-history text-info me-2"></i>Historial de Activaciones
                <span class="badge bg-info ms-2"><?= count($activaciones) ?></span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-sm mb-0" style="font-size:.82rem;">
                        <thead class="table-light"><tr><th>#</th><th>Fecha</th><th>IP</th><th>Servidor</th></tr></thead>
                        <tbody>
                        <?php foreach ($activaciones as $i => $a): ?>
                            <tr>
                                <td><?= $i+1 ?></td>
                                <td><?= date('d/m/Y H:i', strtotime($a['fecha_activacion'])) ?></td>
                                <td><code><?= htmlspecialchars($a['ip_activacion'] ?? '-') ?></code></td>
                                <td style="font-size:.75rem;"><?= htmlspecialchars($a['servidor_info'] ?? '-') ?></td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($activaciones)): ?>
                            <tr><td colspan="4" class="text-center text-muted py-3">Sin activaciones aún</td></tr>
                        <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Pagos Registrados -->
        <div class="card">
            <div class="card-header py-3 bg-white fw-600">
                <i class="fas fa-money-bill-wave text-success me-2"></i>Pagos Registrados
                <span class="badge bg-success ms-2"><?= count($pagos) ?></span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-sm mb-0" style="font-size:.82rem;">
                        <thead class="table-light"><tr><th>Fecha</th><th>Monto</th><th>Método</th><th>Ref.</th><th>Estado</th><th>Acc.</th></tr></thead>
                        <tbody>
                        <?php foreach ($pagos as $p):
                            if ($p['id_licencia'] != $licencia['id_licencia']) continue;
                        ?>
                            <tr>
                                <td><?= date('d/m/Y', strtotime($p['fecha_pago'])) ?></td>
                                <td class="fw-500"><?= $SIM ?> <?= number_format($p['monto'],2) ?></td>
                                <td><?= htmlspecialchars($p['metodo_pago'] ?? '-') ?></td>
                                <td><code><?= htmlspecialchars($p['referencia'] ?? '-') ?></code></td>
                                <td><span class="badge badge-<?= $p['estado_pago'] ?>"><?= $p['estado_pago'] ?></span></td>
                                <td>
                                    <?php if ($p['estado_pago'] !== 'Anulado'): ?>
                                    <a href="<?= BASE_URL ?>/pagos/anular?id=<?= $p['id_pago'] ?>"
                                       class="btn btn-xs btn-sm btn-outline-danger"
                                       onclick="return confirm('¿Anular este pago?')">
                                        <i class="fas fa-times"></i>
                                    </a>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <?php if (empty($pagos)): ?>
                            <tr><td colspan="6" class="text-center text-muted py-3">Sin pagos registrados</td></tr>
                        <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>

<script>
function copiarClave(clave) {
    navigator.clipboard.writeText(clave).then(function() {
        Swal.fire({ icon: 'success', title: '¡Copiado!', text: 'La clave de licencia fue copiada al portapapeles.', timer: 2000, showConfirmButton: false });
    });
}
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
