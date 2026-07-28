<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <a href="<?= BASE_URL ?>/licencias" class="btn btn-sm btn-outline-secondary mb-2">
            <i class="fas fa-arrow-left me-1"></i> Volver
        </a>
        <h4 class="fw-bold mb-1"><i class="fas fa-plus-circle text-success me-2"></i>Generar Nueva Licencia</h4>
    </div>
</div>

<div class="row justify-content-center">
    <div class="col-md-7">
        <div class="card">
            <div class="card-header bg-success text-white py-3">
                <i class="fas fa-certificate me-2"></i>Configurar Licencia
            </div>
            <div class="card-body">
                <form action="<?= BASE_URL ?>/licencias/generar" method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-500">Empresa / EESS <span class="text-danger">*</span></label>
                        <select name="id_empresa" class="form-select" required>
                            <option value="">-- Seleccionar empresa --</option>
                            <?php foreach ($empresas as $e): ?>
                            <option value="<?= $e['id_empresa'] ?>"
                                <?= (isset($_GET['emp']) && $_GET['emp']==$e['id_empresa']) ? 'selected' : '' ?>>
                                <?= htmlspecialchars($e['razon_social']) ?> (RUC: <?= $e['ruc'] ?? 'S/RUC' ?>)
                            </option>
                            <?php endforeach; ?>
                        </select>
                        <small class="text-muted">El RUC de la empresa es parte de la clave de licencia.</small>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-500">Tipo de Período <span class="text-danger">*</span></label>
                            <select name="tipo_periodo" id="tipo_periodo" class="form-select" required onchange="calcularFechaFin()">
                                <option value="demo">Demo (Días)</option>
                                <option value="mensual" selected>Mensual</option>
                                <option value="trimestral">Trimestral (3 meses)</option>
                                <option value="semestral">Semestral (6 meses)</option>
                                <option value="anual">Anual (12 meses)</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Cantidad <span class="text-danger">*</span></label>
                            <input type="number" name="cantidad_periodo" id="cantidad_periodo" class="form-control"
                                   min="1" max="36" value="1" required onchange="calcularFechaFin()">
                            <small class="text-muted">Ej: 2 mensual = 2 meses, 7 demo = 7 días.</small>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-500">Fecha de Inicio <span class="text-danger">*</span></label>
                            <input type="date" name="fecha_inicio" id="fecha_inicio" class="form-control"
                                   value="<?= date('Y-m-d') ?>" required onchange="calcularFechaFin()">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-500">Fecha de Vencimiento</label>
                            <input type="text" id="fecha_fin_display" class="form-control bg-light" readonly
                                   placeholder="Se calcula automáticamente">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-500">Precio (S/) <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <span class="input-group-text">S/</span>
                            <input type="number" name="precio" class="form-control" step="0.01" min="0"
                                   value="0.00" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-500">Notas / Observaciones</label>
                        <textarea name="notas" class="form-control" rows="3"
                                  placeholder="Ej: Incluye soporte técnico, descuento por pronto pago, etc."></textarea>
                    </div>

                    <div class="alert alert-info alert-sm" style="font-size:.82rem;">
                        <i class="fas fa-info-circle me-2"></i>
                        La clave de licencia se generará automáticamente con HMAC-SHA256 basado en el RUC, la empresa y la fecha de vencimiento.
                        El sistema es <strong>100% offline</strong> — no requiere conexión a internet para la validación.
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-success flex-grow-1">
                            <i class="fas fa-key me-2"></i>Generar Licencia
                        </button>
                        <a href="<?= BASE_URL ?>/licencias" class="btn btn-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function calcularFechaFin() {
    const tipo = document.getElementById('tipo_periodo').value;
    const cantidad = parseInt(document.getElementById('cantidad_periodo').value) || 1;
    const inicio = document.getElementById('fecha_inicio').value;
    if (!inicio) return;

    const d = new Date(inicio + 'T00:00:00');
    switch (tipo) {
        case 'demo':       d.setDate(d.getDate() + cantidad); break;
        case 'mensual':    d.setMonth(d.getMonth() + cantidad); break;
        case 'trimestral': d.setMonth(d.getMonth() + (cantidad * 3)); break;
        case 'semestral':  d.setMonth(d.getMonth() + (cantidad * 6)); break;
        case 'anual':      d.setFullYear(d.getFullYear() + cantidad); break;
    }
    d.setDate(d.getDate() - 1); // último día incluido
    const day = String(d.getDate()).padStart(2,'0');
    const mon = String(d.getMonth()+1).padStart(2,'0');
    const yr  = d.getFullYear();
    document.getElementById('fecha_fin_display').value = `${day}/${mon}/${yr}`;
}
calcularFechaFin();
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
