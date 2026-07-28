<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso - Panel de Licencias del Sistema de Citas Médicas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', sans-serif;
            margin: 0;
        }

        .card-login {
            width: 100%;
            max-width: 400px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            border: none;
            background: white;
        }

        .card-header {
            background: white;
            border-bottom: none;
            padding-top: 40px;
            padding-bottom: 20px;
        }

        .btn-primary {
            background: #667eea;
            border: none;
            padding: 12px;
            font-weight: bold;
            transition: 0.3s;
        }

        .btn-primary:hover {
            background: #764ba2;
            transform: translateY(-2px);
        }

        .form-control {
            padding: 12px;
            background: #f8f9fa;
            border: 1px solid #eee;
            color: #212529;
        }

        .form-control:focus {
            box-shadow: none;
            border-color: #667eea;
            background: white;
        }
    </style>
</head>
<body>

    <div class="card card-login">
        <div class="card-header text-center">
            <div class="mb-3" style="color: #667eea;">
                <i class="fas fa-key fa-4x"></i>
            </div>
            <h3 class="fw-bold text-dark mb-0">Panel de Licencias</h3>
            <p class="text-muted small">Sistema de Citas Médicas</p>
        </div>

        <div class="card-body p-4 pt-0">
            <p class="text-center text-muted small mb-4">Acceso exclusivo para el administrador</p>

            <?php if (isset($_GET['error'])): ?>
                <div class="alert alert-danger text-center py-2 mb-3 shadow-sm border-0">
                    <small><i class="fas fa-exclamation-circle me-1"></i> Credenciales incorrectas</small>
                </div>
            <?php endif; ?>

            <form action="<?= BASE_URL ?>/auth/authenticate" method="POST">
                <div class="mb-3">
                    <label class="form-label small text-muted fw-bold">Correo Electrónico</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0 text-secondary"><i class="fas fa-envelope"></i></span>
                        <input type="email" name="email" class="form-control" placeholder="admin@licencias.com" required autocomplete="email">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="form-label small text-muted fw-bold">Contraseña</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0 text-secondary"><i class="fas fa-lock"></i></span>
                        <input type="password" name="password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
                    </div>
                </div>

                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary rounded-pill shadow-sm">
                        INGRESAR <i class="fas fa-arrow-right ms-2"></i>
                    </button>
                </div>
            </form>
        </div>
        <div class="card-footer text-center bg-white py-3 border-0">
            <small class="text-muted opacity-75">
                <i class="fas fa-shield-alt me-1 text-primary"></i>
                Sistema de Licenciamiento — Citas Médicas v<?= LIC_VERSION ?>
            </small>
        </div>
    </div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
