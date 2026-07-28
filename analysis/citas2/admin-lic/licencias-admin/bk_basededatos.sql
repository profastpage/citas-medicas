-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para licencias_db
CREATE DATABASE IF NOT EXISTS `licencias_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `licencias_db`;

-- Volcando estructura para tabla licencias_db.activaciones
CREATE TABLE IF NOT EXISTS `activaciones` (
  `id_activacion` int NOT NULL AUTO_INCREMENT,
  `id_licencia` int NOT NULL,
  `fecha_activacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `ip_activacion` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `servidor_info` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `observacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_activacion`),
  KEY `id_licencia` (`id_licencia`),
  CONSTRAINT `activaciones_ibfk_1` FOREIGN KEY (`id_licencia`) REFERENCES `licencias` (`id_licencia`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.activaciones: ~0 rows (aproximadamente)
DELETE FROM `activaciones`;

-- Volcando estructura para tabla licencias_db.admin_licencias
CREATE TABLE IF NOT EXISTS `admin_licencias` (
  `id_admin` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.admin_licencias: ~1 rows (aproximadamente)
DELETE FROM `admin_licencias`;
INSERT INTO `admin_licencias` (`id_admin`, `nombre`, `email`, `password`, `estado`, `fecha_registro`) VALUES
	(1, 'Super Administrador', 'admin@licencias.com', '$2y$10$o3GiAd6PNk1yAyC4UcV2qeNDrVfvBJ97e6kQl9xYsbp6x.MmgODw6', 1, '2026-03-26 02:52:00');

-- Volcando estructura para tabla licencias_db.configuracion
CREATE TABLE IF NOT EXISTS `configuracion` (
  `id` int NOT NULL DEFAULT '1',
  `simbolo_moneda` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'S/',
  `nombre_moneda` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Sol Peruano',
  `nombre_sistema` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'LIC Manager',
  `nombre_proveedor` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'Mi Empresa',
  `email_proveedor` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono_proveedor` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dias_gracia` int DEFAULT '5',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.configuracion: ~1 rows (aproximadamente)
DELETE FROM `configuracion`;
INSERT INTO `configuracion` (`id`, `simbolo_moneda`, `nombre_moneda`, `nombre_sistema`, `nombre_proveedor`, `email_proveedor`, `telefono_proveedor`, `dias_gracia`, `actualizado_en`) VALUES
	(1, 'S/', 'Sol Peruano', 'LIC Manager', 'Mi Empresa', NULL, NULL, 5, '2026-03-26 04:12:30');

-- Volcando estructura para tabla licencias_db.empresas
CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre_comercial` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ruc` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `responsable` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ciudad` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('Activo','Suspendido','Inactivo') COLLATE utf8mb4_general_ci DEFAULT 'Activo',
  `notas` text COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.empresas: ~1 rows (aproximadamente)
DELETE FROM `empresas`;
INSERT INTO `empresas` (`id_empresa`, `razon_social`, `nombre_comercial`, `ruc`, `responsable`, `email`, `telefono`, `direccion`, `ciudad`, `estado`, `notas`, `fecha_registro`) VALUES
	(1, 'EMPRESA 1', 'EMPRESA 1', '20202020201', 'victor', 'empresa1@correo.com', '90909090', 'LIMA -PERÚ', 'LIMA', 'Activo', '', '2026-03-27 04:04:17');

-- Volcando estructura para tabla licencias_db.licencias
CREATE TABLE IF NOT EXISTS `licencias` (
  `id_licencia` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `clave_licencia` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_periodo` enum('demo','mensual','trimestral','semestral','anual') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'mensual',
  `cantidad_periodo` tinyint unsigned NOT NULL DEFAULT '1',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `precio` decimal(10,2) DEFAULT '0.00',
  `estado` enum('Pendiente','Activa','Vencida','Revocada','Suspendida') COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `notas` text COLLATE utf8mb4_general_ci,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_licencia`),
  UNIQUE KEY `clave_licencia` (`clave_licencia`),
  KEY `id_empresa` (`id_empresa`),
  CONSTRAINT `licencias_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.licencias: ~1 rows (aproximadamente)
DELETE FROM `licencias`;
INSERT INTO `licencias` (`id_licencia`, `id_empresa`, `clave_licencia`, `tipo_periodo`, `cantidad_periodo`, `fecha_inicio`, `fecha_fin`, `precio`, `estado`, `notas`, `creado_en`) VALUES
	(1, 1, 'f2677049cb8c0bbe24b0e14e07dad993c75a12f6aaac26cdadedea18c0c7dde6', 'semestral', 1, '2026-03-27', '2026-09-26', 150.00, 'Activa', '', '2026-03-27 04:04:32');

-- Volcando estructura para tabla licencias_db.pagos_licencia
CREATE TABLE IF NOT EXISTS `pagos_licencia` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_licencia` int NOT NULL,
  `monto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `moneda` varchar(5) COLLATE utf8mb4_general_ci DEFAULT 'PEN',
  `metodo_pago` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referencia` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado_pago` enum('Pendiente','Pagado','Anulado') COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  `observaciones` text COLLATE utf8mb4_general_ci,
  `registrado_por` int DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_licencia` (`id_licencia`),
  CONSTRAINT `pagos_licencia_ibfk_1` FOREIGN KEY (`id_licencia`) REFERENCES `licencias` (`id_licencia`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla licencias_db.pagos_licencia: ~0 rows (aproximadamente)
DELETE FROM `pagos_licencia`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
