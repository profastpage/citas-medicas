<?php
// Generador de PDF de Documentación - Sistema de Licencias
require('fpdf.php');

function utf8_to_iso($text) {
    return mb_convert_encoding($text, 'ISO-8859-1', 'UTF-8');
}

class PDF extends FPDF {
    function Header() {
        // Logo
        $this->SetFillColor(41, 57, 196); // Color principal Indigo
        $this->Rect(0, 0, 210, 40, 'F');
        
        $this->SetFont('Arial', 'B', 24);
        $this->SetTextColor(255, 255, 255);
        $this->Cell(0, 15, 'LIC MANAGER', 0, 1, 'C');
        
        $this->SetFont('Arial', '', 14);
        $this->Cell(0, 10, utf8_to_iso('Manual Técnico y de Despliegue'), 0, 1, 'C');
        $this->Ln(15);
    }

    function Footer() {
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->SetTextColor(128);
        $this->Cell(0, 10, utf8_to_iso('Página ' . $this->PageNo() . ' / {nb}'), 0, 0, 'C');
    }
    
    function SectionTitle($title) {
        $this->Ln(5);
        $this->SetFont('Arial', 'B', 16);
        $this->SetFillColor(240, 245, 255);
        $this->SetTextColor(41, 57, 196);
        $this->Cell(0, 10, utf8_to_iso(' ' . $title), 0, 1, 'L', true);
        $this->Ln(4);
    }

    function SubTitle($title) {
        $this->SetFont('Arial', 'B', 12);
        $this->SetTextColor(50, 50, 50);
        $this->Cell(0, 8, utf8_to_iso($title), 0, 1, 'L');
    }

    function NormalText($text) {
        $this->SetFont('Arial', '', 11);
        $this->SetTextColor(80, 80, 80);
        $this->MultiCell(0, 6, utf8_to_iso($text));
        $this->Ln(2);
    }

    function Bullet($text) {
        $this->SetFont('Arial', '', 11);
        $this->SetTextColor(80, 80, 80);
        $this->Cell(5, 6, chr(149));
        $this->MultiCell(0, 6, utf8_to_iso($text));
    }
    
    function CodeBlock($text) {
        $this->SetFont('Courier', '', 10);
        $this->SetFillColor(245, 245, 245);
        $this->SetTextColor(200, 50, 50);
        $this->MultiCell(0, 6, utf8_to_iso($text), 1, 'L', true);
        $this->Ln(3);
    }
}

$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();

// 1. Tecnologías
$pdf->SectionTitle('1. Tecnologías Utilizadas');
$pdf->NormalText('El sistema Administrador de Licencias (LIC Manager) es una aplicación web backend robusta y segura desarrollada con las siguientes tecnologías:');
$pdf->Bullet('Backend: PHP 8.1+ orientado a objetos (Arquitectura MVC sin frameworks pesados).');
$pdf->Bullet('Base de Datos: MySQL 8 (Sistema relacional para persistencia de datos y activaciones).');
$pdf->Bullet('Frontend / UI: HTML5, Bootstrap 5.3, CSS3 Vanilla (Flexbox/Grid), FontAwesome 6.');
$pdf->Bullet('Interacciones: JavaScript Vanilla (ES6), SweetAlert2 para notificaciones modales.');
$pdf->Bullet('Seguridad: Criptografía asimétrica HMAC-SHA256 para generación y validación de claves en entornos desconectados (Offline).');
$pdf->Bullet('Comunicaciones API: cURL para comunicación RESTFul JSON entre el sistema cliente y el proveedor.');

$pdf->Ln(5);

// 2. Funcionalidades
$pdf->SectionTitle('2. Funcionalidades del Sistema');
$pdf->SubTitle('Arquitectura Híbrida (Online/Offline)');
$pdf->NormalText('El sistema está diseñado para que las clínicas/sistemas clientes no necesiten alojar su información en la nube del proveedor, garantizando máxima privacidad. La validación matemática de la licencia se realiza localmente en la PC del cliente.');
$pdf->Ln(2);
$pdf->SubTitle('Módulo de Empresas');
$pdf->NormalText('Registro centralizado de clínicas o clientes con RUC, Razón Social y datos de contacto.');
$pdf->SubTitle('Módulo de Licencias');
$pdf->NormalText('Generación criptográfica de licencias vinculadas a un hardware o RUC específico. Control de fechas de vencimiento (Mensual, Trimestral, Anual). Funcionalidad de revocación.');
$pdf->SubTitle('Control de Pagos');
$pdf->NormalText('Registro y seguimiento de cobros realizados por cada licencia expedida, métodos de pago y estado de cuenta por cobrar.');
$pdf->SubTitle('API de Sincronización Remota');
$pdf->NormalText('Endpoint seguro que permite a los sistemas clientes descargar e instalar sus licencias a través de internet con un solo clic, sin intervención manual de copiado de claves.');

// Nueva página para Instalación
$pdf->AddPage();

// 3. Instalación Local
$pdf->SectionTitle('3. Instalación Local (Paso a Paso)');
$pdf->NormalText('Para poner el sistema en marcha en un entorno de desarrollo (PC nueva):');
$pdf->SubTitle('A. Software Necesario');
$pdf->Bullet('1. Descargar e instalar Laragon (Recomendado: Full Version con PHP 8.1+).');
$pdf->Bullet('2. Asegurarse de que Apache y MySQL estén iniciados en Laragon.');

$pdf->SubTitle('B. Configuración de Archivos');
$pdf->Bullet('1. Extraer los archivos del proyecto dentro de: C:\laragon\www\licencias-admin');
$pdf->Bullet('2. Importar la base de datos SQL provista usando HeidiSQL (incluido en Laragon) o phpMyAdmin en una base llamada "licencias_db".');
$pdf->Bullet('3. Editar el archivo /app/config/Database.php con las credenciales locales (root y sin contraseña en Laragon).');

$pdf->SubTitle('C. Hosts Virtuales');
$pdf->NormalText('El sistema detecta automáticamente su entorno. Puede acceder a él a través de:');
$pdf->CodeBlock('http://localhost/licencias-admin/public/'."\n".'https://licencias-admin.test/');

$pdf->SubTitle('D. Credenciales de Administrador');
$pdf->NormalText('Para ingresar al panel de control, utilice las siguientes credenciales:');
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(40, 8, 'Usuario:', 0, 0);
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 8, 'admin@licencias.com', 0, 1);
$pdf->SetFont('Arial', 'B', 12);
$pdf->Cell(40, 8, 'Password:', 0, 0);
$pdf->SetFont('Arial', '', 12);
$pdf->Cell(0, 8, 'Sistemas2025', 0, 1);

// 4. Despliegue Producción
$pdf->AddPage();
$pdf->SectionTitle('4. Sugerencia de Hosting Web');
$pdf->NormalText('Dado que este sistema actuará como la "API Principal" para validar todas sus instalaciones externas, requiere altísima disponibilidad y control.');

$pdf->SubTitle('Recomendación Principal: DigitalOcean (VPS Linux)');
$pdf->NormalText('Los servidores compartidos (Hostgator, GoDaddy) suelen tener problemas de bloqueo de puertos (cURL) o reglas mod_security agresivas que bloquean conexiones API.');
$pdf->NormalText('DigitalOcean Droplet (Ubuntu 22.04 + CyberPanel o aapanel) ofrece control total a bajo costo (aprox. $6/mes).');

$pdf->SubTitle('Paso a Paso de Despliegue en VPS');
$pdf->Bullet('1. Crear un Droplet en DigitalOcean (OS: Ubuntu).');
$pdf->Bullet('2. Instalar el panel de control gratuito (ej. CyberPanel) vía SSH.');
$pdf->Bullet('3. Crear el sitio web (ej. licencias.tu-dominio.com) y emitir certificado SSL (Let\'s Encrypt).');
$pdf->Bullet('4. Ir al Administrador de Archivos del panel web, y subir los archivos del proyecto a la carpeta public_html.');
$pdf->Bullet('5. Crear una Base de Datos en el panel de control, y subir el archivo .sql.');
$pdf->Bullet('6. Editar app/config/Database.php con las claves de la base de datos recién creada en producción.');
$pdf->Bullet('7. ¡MUY IMPORTANTE! Si el instalador coloca todo en public_html, debe configurar la raíz del documento (DocumentRoot) para que apunte a "public_html/public" por motivos de seguridad, o usar el archivo .htaccess provisto.');

$pdf->Output('F', 'C:/laragon/www/sistema-citasmedicas/docs/Manual_Instalacion_Licencias.pdf');
echo "PDF generado exitosamente en C:/laragon/www/sistema-citasmedicas/docs/Manual_Instalacion_Licencias.pdf";
