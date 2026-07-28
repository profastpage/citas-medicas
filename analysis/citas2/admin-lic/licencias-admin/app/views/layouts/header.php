<?php
if (session_status() === PHP_SESSION_NONE) session_start();
if (!isset($_SESSION['admin_lic_id'])) { header('Location: ' . BASE_URL . '/login'); exit; }
$adminNombre = $_SESSION['admin_lic_nombre'] ?? 'Admin';
$currentUrl  = $_SERVER['REQUEST_URI'];
// Cargar configuración global (moneda, etc.)
if (!function_exists('lic_config')) {
    require_once APP_ROOT . '/controllers/ConfiguracionLicController.php';
}
$LIC_CONFIG = ConfiguracionLicController::getConfig();
$SIM = $LIC_CONFIG['simbolo_moneda'] ?? 'S/';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Licencias - Sistema Citas Médicas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        :root {
            --sidebar-bg: #1e2125;
            --sidebar-accent: #0d6efd;
            --sidebar-text: #adb5bd;
            --sidebar-hover: #2c3036;
            --topbar-bg: #ffffff;
        }
        body { font-family: 'Poppins', sans-serif; background: #f1f5f9; overflow-x: hidden; }
        #wrapper { display: flex; min-height: 100vh; }
        #sidebar {
            width: 260px; min-height: 100vh; background: var(--sidebar-bg);
            transition: all 0.3s; flex-shrink: 0;
            display: flex; flex-direction: column;
        }
        #sidebar.collapsed { margin-left: -260px; }
        .sidebar-brand {
            padding: 1.5rem 1.25rem; border-bottom: 1px solid #2c3036;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background-color: #212529; min-height: 120px;
        }
        .sidebar-brand .brand-icon {
            display:flex; align-items:center; justify-content:center;
            color:#fff; font-size:2rem; flex-shrink:0; margin-bottom: 0.5rem;
        }
        .brand-text { color: #fff; font-weight: 700; font-size: 1.1rem; line-height:1.2; text-align: center; }
        .brand-sub { color: #adb5bd; font-size: .8rem; font-weight:500; text-align: center; margin-top: 0.2rem; }
        .nav-section { padding: .5rem 1rem .25rem; color: #adb5bd; font-size: .65rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; margin-top:.5rem; }
        .sidebar-link {
            display:flex; align-items:center; gap:.75rem;
            padding:12px 25px; color: var(--sidebar-text);
            text-decoration:none; font-size:.9rem; border-left: 4px solid transparent;
            transition: all .2s;
        }
        .sidebar-link:hover {
            background: var(--sidebar-hover); color:#fff;
            border-left-color: var(--sidebar-accent);
        }
        .sidebar-link.active {
            background: var(--sidebar-accent); color:#fff;
            font-weight: 600; border-left-color: var(--sidebar-accent);
        }
        .sidebar-link i { width:25px; text-align:center; }
        .sidebar-link .badge { margin-left:auto; }
        #topbar {
            background: var(--topbar-bg); box-shadow: 0 1px 4px rgba(0,0,0,.08);
            padding: .75rem 1.5rem; display:flex; align-items:center; gap:1rem;
        }
        #page-content { flex: 1; min-width:0; display:flex; flex-direction:column; }
        .page-body { flex:1; padding: 1.5rem; }
        .card { border:none; box-shadow:0 1px 4px rgba(0,0,0,.07); border-radius:12px; }
        .stat-card { border-radius:14px; padding:1.25rem 1.5rem; color:#fff; transition: transform .2s; }
        .stat-card:hover { transform: translateY(-3px); }
        .stat-card .stat-icon { font-size:2rem; opacity:.7; }
        .stat-card .stat-value { font-size:2rem; font-weight:700; line-height:1; }
        .stat-card .stat-label { font-size:.8rem; opacity:.85; }
        .badge-Activa { background:#dcfce7; color:#166534; }
        .badge-Vencida { background:#fee2e2; color:#991b1b; }
        .badge-Pendiente { background:#fef9c3; color:#854d0e; }
        .badge-Revocada { background:#f1f5f9; color:#475569; }
        .badge-Pagado { background:#dcfce7; color:#166534; }
        .badge-Anulado { background:#fee2e2; color:#991b1b; }
        .badge-Suspendida { background:#fef3c7; color:#b45309; }
        @media(max-width:768px) {
            #sidebar { margin-left: -260px; position:fixed; z-index:999; height:100%; }
            #sidebar.show { margin-left:0; }
        }
    </style>
</head>
<body>
<div id="wrapper">
    <!-- SIDEBAR -->
    <nav id="sidebar">
        <div class="sidebar-brand">
            <div class="brand-icon"><i class="fas fa-key"></i></div>
            <div>
                <div class="brand-text">Panel de Licencia</div>
                <div class="brand-sub">Sistema Citas Médicas</div>
            </div>
        </div>
        <div class="pt-2">
            <div class="nav-section">Principal</div>
            <a href="<?= BASE_URL ?>/dashboard" class="sidebar-link <?= strpos($currentUrl,'dashboard') !== false ? 'active' : '' ?>">
                <i class="fas fa-chart-pie"></i> Dashboard
            </a>
            <div class="nav-section">Gestión</div>
            <a href="<?= BASE_URL ?>/empresas" class="sidebar-link <?= strpos($currentUrl,'empresas') !== false ? 'active' : '' ?>">
                <i class="fas fa-building"></i> Empresas / EESS
            </a>
            <a href="<?= BASE_URL ?>/licencias" class="sidebar-link <?= strpos($currentUrl,'licencias') !== false ? 'active' : '' ?>">
                <i class="fas fa-certificate"></i> Licencias
            </a>
            <a href="<?= BASE_URL ?>/licencias/activaciones" class="sidebar-link <?= strpos($currentUrl,'activaciones') !== false ? 'active' : '' ?>">
                <i class="fas fa-history"></i> Historial Activaciones
            </a>
            <div class="nav-section">Finanzas</div>
            <a href="<?= BASE_URL ?>/pagos" class="sidebar-link <?= strpos($currentUrl,'pago') !== false ? 'active' : '' ?>">
                <i class="fas fa-file-invoice-dollar"></i> Control de Pagos
            </a>
            <div class="nav-section">Sistema</div>
            <a href="<?= BASE_URL ?>/configuracion" class="sidebar-link <?= strpos($currentUrl,'configuracion') !== false ? 'active' : '' ?>">
                <i class="fas fa-cog"></i> Configuración
            </a>
        </div>
        <div class="p-3 mt-auto" style="border-top:1px solid #1e293b;">
            <a href="<?= BASE_URL ?>/auth/logout" class="btn btn-outline-danger w-100 btn-sm">
                <i class="fas fa-sign-out-alt me-1"></i> Cerrar Sesión
            </a>
        </div>
    </nav>

    <!-- CONTENT -->
    <div id="page-content">
        <div id="topbar">
            <button class="btn btn-light btn-sm" id="sidebarToggle"><i class="fas fa-bars"></i></button>
            <div class="ms-auto d-flex align-items-center gap-2">
                <div class="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center"
                     style="width:40px;height:40px;font-size:1rem;">
                    <i class="fas fa-user-shield"></i>
                </div>
                <div class="d-none d-sm-block">
                    <div style="font-size:.75rem;color:#64748b;">Super Admin</div>
                    <div style="font-size:.85rem;font-weight:600;"><?= htmlspecialchars($adminNombre) ?></div>
                </div>
            </div>
        </div>
        <div class="page-body">
