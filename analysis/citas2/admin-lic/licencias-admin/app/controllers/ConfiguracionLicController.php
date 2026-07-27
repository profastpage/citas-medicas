<?php
require_once APP_ROOT . '/config/Database.php';

class ConfiguracionLicController
{
    private $db;

    public function __construct()
    {
        $this->db = (new Database())->connect();
    }

    public function index()
    {
        $config = $this->getConfig();
        require_once APP_ROOT . '/views/configuracion/index.php';
    }

    public function guardar()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: ' . BASE_URL . '/configuracion');
            exit;
        }

        $simbolo          = trim($_POST['simbolo_moneda']     ?? 'S/');
        $nombre_moneda    = trim($_POST['nombre_moneda']      ?? 'Sol Peruano');
        $nombre_sistema   = trim($_POST['nombre_sistema']     ?? 'LIC Manager');
        $nombre_proveedor = trim($_POST['nombre_proveedor']   ?? '');
        $email_proveedor  = trim($_POST['email_proveedor']    ?? '');
        $telefono         = trim($_POST['telefono_proveedor'] ?? '');
        $dias_gracia      = (int)($_POST['dias_gracia']       ?? 5);

        $stmt = $this->db->prepare("
            INSERT INTO configuracion 
                (id, simbolo_moneda, nombre_moneda, nombre_sistema, nombre_proveedor, email_proveedor, telefono_proveedor, dias_gracia)
            VALUES (1, :sm, :nm, :ns, :np, :ep, :tp, :dg)
            ON DUPLICATE KEY UPDATE
                simbolo_moneda     = VALUES(simbolo_moneda),
                nombre_moneda      = VALUES(nombre_moneda),
                nombre_sistema     = VALUES(nombre_sistema),
                nombre_proveedor   = VALUES(nombre_proveedor),
                email_proveedor    = VALUES(email_proveedor),
                telefono_proveedor = VALUES(telefono_proveedor),
                dias_gracia        = VALUES(dias_gracia)
        ");
        $stmt->execute([
            ':sm' => $simbolo,
            ':nm' => $nombre_moneda,
            ':ns' => $nombre_sistema,
            ':np' => $nombre_proveedor,
            ':ep' => $email_proveedor,
            ':tp' => $telefono,
            ':dg' => $dias_gracia,
        ]);

        // Guardar en sesión para uso inmediato sin recargar BD
        $_SESSION['lic_config'] = $this->getConfig();

        header('Location: ' . BASE_URL . '/configuracion?ok=1');
        exit;
    }

    /**
     * Obtiene la configuración de la BD (o valores por defecto).
     * Se puede llamar estáticamente desde cualquier vista/controlador.
     */
    public static function getConfig(): array
    {
        // Si está en sesión, usarla para evitar consulta extra
        if (!empty($_SESSION['lic_config'])) {
            return $_SESSION['lic_config'];
        }

        try {
            $db   = (new Database())->connect();
            $stmt = $db->query("SELECT * FROM configuracion WHERE id = 1 LIMIT 1");
            $cfg  = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($cfg) {
                $_SESSION['lic_config'] = $cfg;
                return $cfg;
            }
        } catch (Exception $e) { }

        return [
            'simbolo_moneda'     => 'S/',
            'nombre_moneda'      => 'Sol Peruano',
            'nombre_sistema'     => 'LIC Manager',
            'nombre_proveedor'   => '',
            'email_proveedor'    => '',
            'telefono_proveedor' => '',
            'dias_gracia'        => 5,
        ];
    }
}
