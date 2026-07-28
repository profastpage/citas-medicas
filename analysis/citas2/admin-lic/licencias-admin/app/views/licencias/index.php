<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-certificate text-primary me-2"></i>Licencias</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Gestión y control de todas las licencias</p>
    </div>
    <a href="<?= BASE_URL ?>/licencias/generar" class="btn btn-success rounded-pill px-4">
        <i class="fas fa-plus me-2"></i>Generar Licencia
    </a>
</div>

<!-- Filtros -->
<div class="card mb-3">
    <div class="card-body py-3">
        <form method="GET" class="row g-2 align-items-end">
            <div class="col-md-4">
                <label class="form-label form-label-sm mb-1">Empresa</label>
                <select name="id_empresa" class="form-select form-select-sm">
                    <option value="">-- Todas las empresas --</option>
                    <?php foreach ($empresas as $e): ?>
                    <option value="<?= $e['id_empresa'] ?>" <?= (($_GET['id_empresa'] ?? '')==$e['id_empresa']) ? 'selected' : '' ?>>
                        <?= htmlspecialchars($e['razon_social']) ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label form-label-sm mb-1">Estado</label>
                <select name="estado" class="form-select form-select-sm">
                    <option value="">-- Todos --</option>
                    <?php foreach (['Pendiente','Activa','Vencida','Revocada','Suspendida'] as $est): ?>
                    <option value="<?= $est ?>" <?= (($_GET['estado'] ?? '')===$est) ? 'selected' : '' ?>><?= $est ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-filter me-1"></i>Filtrar</button>
                <a href="<?= BASE_URL ?>/licencias" class="btn btn-secondary btn-sm ms-1">Limpiar</a>
            </div>
        </form>
    </div>
</div>

<?php if (isset($_GET['ok'])): ?>
<div class="alert alert-<?= $_GET['ok']==='rev' ? 'warning' : 'success' ?> alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>
    <?= $_GET['ok']==='rev' ? 'Licencia revocada.' : 'Operación exitosa.' ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<?php if (isset($_GET['s'])): ?>
<div class="alert alert-success alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>
    <?= $_GET['s']==='susp' ? 'Licencia pausada correctamente.' : 'Licencia reanudada exitosamente.' ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-hover datatable" style="font-size:.83rem;">
                <thead class="table-light">
                    <tr>
                        <th>#</th><th>Empresa</th><th>RUC</th><th>Período</th>
                        <th>Inicio</th><th>Vence</th><th>Precio</th><th>Estado</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                <?php foreach ($licencias as $l): ?>
                    <tr>
                        <td><?= $l['id_licencia'] ?></td>
                        <td class="fw-500"><?= htmlspecialchars($l['razon_social']) ?></td>
                        <td><code><?= htmlspecialchars($l['ruc'] ?? '-') ?></code></td>
                        <td><?= $l['cantidad_periodo'] ?> <?= ucfirst($l['tipo_periodo']) ?></td>
                        <td><?= date('d/m/Y', strtotime($l['fecha_inicio'])) ?></td>
                        <td>
                            <?= date('d/m/Y', strtotime($l['fecha_fin'])) ?>
                            <?php
                            $dias = (new DateTime())->diff(new DateTime($l['fecha_fin']))->days;
                            $pasado = new DateTime() > new DateTime($l['fecha_fin']);
                            if (!$pasado && $dias <= 30 && $l['estado']==='Activa'):
                            ?><br><small class="text-warning"><i class="fas fa-exclamation-triangle me-1"></i><?= $dias ?> días</small>
                            <?php endif; ?>
                        </td>
                        <td><?= $SIM ?> <?= number_format($l['precio'], 2) ?></td>
                        <td><span class="badge badge-<?= $l['estado'] ?>"><?= $l['estado'] ?></span></td>
                        <td>
                            <a href="<?= BASE_URL ?>/licencias/ver?id=<?= $l['id_licencia'] ?>" class="btn btn-sm btn-info text-white" title="Ver"><i class="fas fa-eye"></i></a>
                            <?php if (in_array($l['estado'], ['Activa', 'Pendiente'])): ?>
                            <a href="<?= BASE_URL ?>/licencias/suspender?id=<?= $l['id_licencia'] ?>&back=<?= urlencode(BASE_URL . '/licencias') ?>" class="btn btn-sm btn-warning text-white" title="Pausar" onclick="return confirm('¿Pausar licencia?')"><i class="fas fa-pause"></i></a>
                            <?php elseif ($l['estado'] === 'Suspendida'): ?>
                            <a href="<?= BASE_URL ?>/licencias/reactivar?id=<?= $l['id_licencia'] ?>&back=<?= urlencode(BASE_URL . '/licencias') ?>" class="btn btn-sm btn-success" title="Reanudar" onclick="return confirm('¿Reanudar licencia?')"><i class="fas fa-play"></i></a>
                            <?php endif; ?>
                            <?php if ($l['estado'] !== 'Revocada'): ?>
                            <a href="<?= BASE_URL ?>/licencias/revocar?id=<?= $l['id_licencia'] ?>"
                               class="btn btn-sm btn-danger" title="Revocar"
                               onclick="return confirm('¿Revocar esta licencia?')">
                                <i class="fas fa-ban"></i>
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
