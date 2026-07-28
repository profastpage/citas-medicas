<?php require_once APP_ROOT . '/views/layouts/header.php'; ?>

<?php
$cfg = ConfiguracionLicController::getConfig();
$simbolos_comunes = ['S/' => 'Soles (S/)', '$' => 'Dólar ($)', '€' => 'Euro (€)', '£' => 'Libra (£)', 'Q' => 'Quetzal (Q)', 'Bs.' => 'Bolívar (Bs.)', 'COP$' => 'Peso Colombiano (COP$)', 'MXN$' => 'Peso Mexicano (MXN$)'];
?>

<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h4 class="fw-bold mb-1"><i class="fas fa-cog text-primary me-2"></i>Configuración del Sistema</h4>
        <p class="text-muted mb-0" style="font-size:.85rem;">Ajustes generales del panel de licencias</p>
    </div>
</div>

<?php if (isset($_GET['ok'])): ?>
<div class="alert alert-success alert-dismissible fade show">
    <i class="fas fa-check-circle me-2"></i>Configuración guardada correctamente.
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>
<?php endif; ?>

<form action="<?= BASE_URL ?>/configuracion/guardar" method="POST">

    <div class="row g-4">

        <!-- Moneda -->
        <div class="col-lg-6">
            <div class="card h-100">
                <div class="card-header fw-600 py-3" style="border-left:4px solid #6366f1;">
                    <i class="fas fa-dollar-sign me-2 text-primary"></i>Moneda y Formato de Precio
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label fw-500">Símbolo de Moneda <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <select name="simbolo_moneda" class="form-select" id="selectSimboloPreset" onchange="actualizarSimbolo(this.value)">
                                <?php foreach ($simbolos_comunes as $val => $label): ?>
                                <option value="<?= $val ?>" <?= ($cfg['simbolo_moneda'] ?? 'S/') === $val ? 'selected' : '' ?>><?= $label ?></option>
                                <?php endforeach; ?>
                                <option value="otro">Otro (personalizado)...</option>
                            </select>
                        </div>
                        <div class="mt-2" id="divPersonalizado" style="display:none;">
                            <input type="text" id="simboloPersonalizado" class="form-control" placeholder="Ej: MXN, CLP$" maxlength="10" onkeyup="document.getElementById('selectSimboloPreset').value='otro'; this.form.elements['simbolo_moneda'].value = this.value;">
                        </div>
                        <small class="text-muted d-block mt-1">Aparecerá en todos los montos del sistema: <span class="fw-bold text-primary" id="preview_moneda"><?= htmlspecialchars($cfg['simbolo_moneda'] ?? 'S/') ?></span> 30.00</small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-500">Nombre de la Moneda</label>
                        <input type="text" name="nombre_moneda" class="form-control" value="<?= htmlspecialchars($cfg['nombre_moneda'] ?? 'Sol Peruano') ?>" placeholder="Ej: Sol Peruano, Dólar Americano">
                    </div>
                </div>
            </div>
        </div>

        <!-- Datos del Proveedor -->
        <div class="col-lg-6">
            <div class="card h-100">
                <div class="card-header fw-600 py-3" style="border-left:4px solid #10b981;">
                    <i class="fas fa-building me-2 text-success"></i>Datos del Proveedor
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label fw-500">Nombre del Sistema</label>
                        <input type="text" name="nombre_sistema" class="form-control" value="<?= htmlspecialchars($cfg['nombre_sistema'] ?? 'LIC Manager') ?>" placeholder="Ej: LIC Manager">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-500">Nombre del Proveedor / Empresa</label>
                        <input type="text" name="nombre_proveedor" class="form-control" value="<?= htmlspecialchars($cfg['nombre_proveedor'] ?? '') ?>" placeholder="Razón Social">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-500">Email de Contacto</label>
                        <input type="email" name="email_proveedor" class="form-control" value="<?= htmlspecialchars($cfg['email_proveedor'] ?? '') ?>" placeholder="proveedor@empresa.com">
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-500">Teléfono</label>
                        <input type="text" name="telefono_proveedor" class="form-control" value="<?= htmlspecialchars($cfg['telefono_proveedor'] ?? '') ?>" placeholder="+51 999 999 999">
                    </div>
                </div>
            </div>
        </div>

        <!-- Licenciamiento -->
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header fw-600 py-3" style="border-left:4px solid #f59e0b;">
                    <i class="fas fa-shield-alt me-2 text-warning"></i>Parámetros de Licenciamiento
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label fw-500">Días de Gracia tras Vencimiento <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <input type="number" name="dias_gracia" class="form-control" min="0" max="30" value="<?= (int)($cfg['dias_gracia'] ?? 5) ?>">
                            <span class="input-group-text">días</span>
                        </div>
                        <small class="text-muted">Días que el sistema del cliente seguirá funcionando tras vencer la licencia. (Actualmente requiere reiniciar el sistema cliente para actualizar.)</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Panel de Resumen -->
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header fw-600 py-3" style="border-left:4px solid #64748b;">
                    <i class="fas fa-eye me-2 text-secondary"></i>Vista Previa
                </div>
                <div class="card-body">
                    <div class="p-3 rounded" style="background:#f8fafc;font-size:.9rem;">
                        <div class="mb-2"><span class="text-muted">Sistema:</span> <strong id="prev_sistema"><?= htmlspecialchars($cfg['nombre_sistema'] ?? 'LIC Manager') ?></strong></div>
                        <div class="mb-2"><span class="text-muted">Moneda:</span> <strong id="prev_moneda"><?= htmlspecialchars($cfg['nombre_moneda'] ?? 'Sol Peruano') ?></strong></div>
                        <div class="mb-2"><span class="text-muted">Monto ejemplo:</span> <strong class="text-success"><span id="prev_simbolo"><?= htmlspecialchars($cfg['simbolo_moneda'] ?? 'S/') ?></span> 150.00</strong></div>
                        <div class="mb-2"><span class="text-muted">Gracia:</span> <strong id="prev_gracia"><?= (int)($cfg['dias_gracia'] ?? 5) ?></strong> días</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="mt-4 d-flex gap-2 justify-content-end">
        <a href="<?= BASE_URL ?>/dashboard" class="btn btn-outline-secondary"><i class="fas fa-times me-2"></i>Cancelar</a>
        <button type="submit" class="btn btn-primary px-4"><i class="fas fa-save me-2"></i>Guardar Configuración</button>
    </div>
</form>

<script>
const simbolosMap = <?= json_encode(array_keys($simbolos_comunes)) ?>;

function actualizarSimbolo(val) {
    if (val === 'otro') {
        document.getElementById('divPersonalizado').style.display = 'block';
    } else {
        document.getElementById('divPersonalizado').style.display = 'none';
        document.getElementById('preview_moneda').textContent = val;
        document.getElementById('prev_simbolo').textContent   = val;
        // Para que se envíe el valor correcto en el submit
        document.querySelector('select[name="simbolo_moneda"]').value = val;
    }
}

// Live preview
document.querySelectorAll('input[name="nombre_sistema"]').forEach(el => {
    el.addEventListener('input', () => document.getElementById('prev_sistema').textContent = el.value || 'LIC Manager');
});
document.querySelectorAll('input[name="nombre_moneda"]').forEach(el => {
    el.addEventListener('input', () => document.getElementById('prev_moneda').textContent = el.value || '');
});
document.querySelectorAll('input[name="dias_gracia"]').forEach(el => {
    el.addEventListener('input', () => document.getElementById('prev_gracia').textContent = el.value || '5');
});
</script>

<?php require_once APP_ROOT . '/views/layouts/footer.php'; ?>
