<?php
// ================================================================
// PUNTO DE ENTRADA: Panel de Administración de Licencias
// URL: http://localhost/licencias-admin/public/
// ================================================================
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

ini_set('display_errors', 1);
error_reporting(E_ALL);

$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$domainName = $_SERVER['HTTP_HOST'];
$scriptPath = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
$scriptPath = rtrim($scriptPath, '/');

define('BASE_URL', $protocol . $domainName . $scriptPath);
define('APP_ROOT', dirname(__DIR__) . '/app');
define('LIC_VERSION', '1.0.0');

// Autocarga de controladores
$controladores = ['AuthLicController', 'DashboardLicController', 'EmpresaController', 'LicenciaController', 'PagoLicController', 'ApiController', 'ConfiguracionLicController'];
foreach ($controladores as $ctrl) {
    $path = APP_ROOT . '/controllers/' . $ctrl . '.php';
    if (file_exists($path)) require_once $path;
}

// Router
$request_uri = $_SERVER['REQUEST_URI'];
$base_path   = dirname($_SERVER['SCRIPT_NAME']);
$url = (strpos($request_uri, $base_path) === 0) ? substr($request_uri, strlen($base_path)) : $request_uri;
$url = trim($url, '/');
if (($pos = strpos($url, '?')) !== false) $url = substr($url, 0, $pos);

$urlArray = explode('/', $url);
$controllerName = !empty($urlArray[0]) ? $urlArray[0] : 'dashboard';

// Seguridad
$adminId = $_SESSION['admin_lic_id'] ?? null;
$publicRoutes = ['login', 'auth', 'api'];
$action = $urlArray[1] ?? '';

if (!$adminId && !in_array($controllerName, $publicRoutes)) {
    $controllerName = 'login';
}

// Si está logueado, no puede ir al login (pero sí al logout)
if ($adminId && in_array($controllerName, $publicRoutes)) {
    if (!($controllerName === 'auth' && $action === 'logout') && $controllerName !== 'api') {
        header('Location: ' . BASE_URL . '/dashboard');
        exit;
    }
}

// Routes
switch ($controllerName) {
    case 'api':
        $c = new ApiController();
        if (isset($urlArray[1]) && $urlArray[1] === 'verificar-licencia') {
            $c->verificarLicencia();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint API no encontrado.']);
            exit;
        }
        break;

    case 'auth':
        $c = new AuthLicController();
        if (isset($urlArray[1]) && $urlArray[1] === 'authenticate') $c->authenticate();
        elseif (isset($urlArray[1]) && $urlArray[1] === 'logout') $c->logout();
        break;

    case 'login':
        $c = new AuthLicController();
        $c->login();
        break;

    case 'dashboard':
        $c = new DashboardLicController();
        $c->index();
        break;

    case 'empresas':
        $c = new EmpresaController();
        if (isset($urlArray[1])) {
            if ($urlArray[1] === 'guardar')    $c->guardar();
            elseif ($urlArray[1] === 'actualizar') $c->actualizar();
            elseif ($urlArray[1] === 'eliminar')   $c->eliminar();
            elseif ($urlArray[1] === 'ver')        $c->ver();
            else $c->index();
        } else { $c->index(); }
        break;

    case 'licencias':
        $c = new LicenciaController();
        if (isset($urlArray[1])) {
            if ($urlArray[1] === 'generar')         $c->generar();
            elseif ($urlArray[1] === 'revocar')          $c->revocar();
            elseif ($urlArray[1] === 'suspender')        $c->suspender();
            elseif ($urlArray[1] === 'reactivar')        $c->reactivar();
            elseif ($urlArray[1] === 'activaciones')     $c->activaciones();
            elseif ($urlArray[1] === 'marcarActivada')   $c->marcarActivada();
            elseif ($urlArray[1] === 'ver')              $c->ver();
            else $c->index();
        } else { $c->index(); }
        break;

    case 'pagos':
        $c = new PagoLicController();
        if (isset($urlArray[1])) {
            if ($urlArray[1] === 'registrar') $c->registrar();
            elseif ($urlArray[1] === 'anular')    $c->anular();
            else $c->index();
        } else { $c->index(); }
        break;

    case 'configuracion':
        $c = new ConfiguracionLicController();
        if ($action === 'guardar') $c->guardar();
        else $c->index();
        break;

    default:
        header('Location: ' . BASE_URL . '/dashboard');
        break;
}
