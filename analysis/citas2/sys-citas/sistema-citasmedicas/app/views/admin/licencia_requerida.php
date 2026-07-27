<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Licencia Requerida - Sistema de Citas Médicas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1a1045 100%);
            min-height: 100vh; display: flex; align-items: center; justify-content: center;
        }
        .lic-card {
            max-width: 520px; width: 100%;
            background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px; padding: 2.5rem;
            box-shadow: 0 25px 60px rgba(0,0,0,.5);
        }
        .icon-circle {
            width:80px; height:80px; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            margin:0 auto 1.5rem; font-size:2rem;
        }
        .icon-danger { background:rgba(239,68,68,.2); color:#f87171; border:2px solid rgba(239,68,68,.4); }
        .icon-warning { background:rgba(245,158,11,.2); color:#fbbf24; border:2px solid rgba(245,158,11,.4); }
        h3 { color:#fff; font-weight:700; }
        p { color:#94a3b8; font-size:.9rem; }
        .form-label { color:#cbd5e1; font-size:.83rem; }
        .form-control, .form-select {
            background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15);
            color:#fff; border-radius:8px;
        }
        .form-control:focus { background:rgba(255,255,255,.12); border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.2); color:#fff; }
        .form-control::placeholder { color:#64748b; }
        .btn-activate {
            background:linear-gradient(135deg,#6366f1,#8b5cf6); border:none;
            border-radius:10px; font-weight:600; color:#fff; transition:all .3s;
        }
        .btn-activate:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(99,102,241,.4); color:#fff; }
        .info-box { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:1rem; }
    </style>
</head>
<body>
<div class="lic-card">
    <?php
    $estadoStr = $resultado['estado'] ?? '';
    if ($estadoStr === 'Suspendida') {
        $iconClass = 'icon-warning';
        $iconName = 'pause-circle';
        $titulo = 'Licencia Pausada';
    } elseif ($estadoStr === 'Revocada') {
        $iconClass = 'icon-danger';
        $iconName = 'ban';
        $titulo = 'Licencia Revocada';
    } elseif ($estadoStr === 'Vencida') {
        $iconClass = 'icon-danger';
        $iconName = 'times-circle';
        $titulo = 'Licencia Vencida';
    } else {
        $iconClass = 'icon-warning';
        $iconName = 'exclamation-triangle';
        $titulo = 'Licencia No Activada';
    }
    ?>
    <div class="icon-circle <?= $iconClass ?>"><i class="fas fa-<?= $iconName ?>"></i></div>
    <h3 class="text-center mb-2"><?= $titulo ?></h3>
    <p class="text-center mb-4"><?= htmlspecialchars($resultado['mensaje']) ?></p>

    <!-- Formulario Manual (Offline) -->
    <div>
            <form action="<?= BASE_URL ?>/licencia/activar" method="POST">
                <div class="mb-3">
                    <label class="form-label">ID de Empresa <span class="text-danger">*</span></label>
                    <input type="number" name="id_empresa" class="form-control" required placeholder="N° asignado por el proveedor">
                </div>
                <div class="mb-3">
                    <label class="form-label">RUC de la Empresa <span class="text-danger">*</span></label>
                    <input type="text" name="ruc_empresa" class="form-control" maxlength="20" required placeholder="20123456789">
                </div>
                <div class="mb-3">
                    <label class="form-label">Nombre de la Empresa</label>
                    <input type="text" name="empresa_nombre" class="form-control" placeholder="Razón Social">
                </div>
                <div class="mb-3">
                    <label class="form-label">Fecha de Vencimiento <span class="text-danger">*</span></label>
                    <input type="date" name="fecha_vencimiento" class="form-control" required>
                </div>
                <div class="mb-4">
                    <label class="form-label">Clave de Licencia <span class="text-danger">*</span></label>
                    <textarea name="clave_licencia" class="form-control font-monospace" rows="3" required
                              placeholder="Clave de 64 caracteres..." style="font-size:.78rem;"></textarea>
                </div>

                <button type="submit" class="btn btn-secondary w-100 py-2 mb-3 mt-2" style="border-radius:10px;">
                    <i class="fas fa-key me-2"></i>Activar Manualmente
                </button>
            </form>
        </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
