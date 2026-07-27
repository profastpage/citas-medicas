-- ================================================================
-- BASE DE DATOS: licencias_db
-- Sistema de Licenciamiento - Panel del Proveedor
-- ================================================================

CREATE DATABASE IF NOT EXISTS `licencias_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `licencias_db`;

-- ----------------------------------------------------------------
-- Tabla: admin_licencias (Usuarios del panel del proveedor)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_licencias` (
  `id_admin`         INT NOT NULL AUTO_INCREMENT,
  `nombre`           VARCHAR(100) NOT NULL,
  `email`            VARCHAR(100) NOT NULL UNIQUE,
  `password`         VARCHAR(255) NOT NULL,
  `estado`           TINYINT(1) DEFAULT 1,
  `fecha_registro`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Usuario administrador por defecto (password: Admin2024$)
INSERT INTO `admin_licencias` (`nombre`, `email`, `password`) VALUES
('Super Administrador', 'admin@licencias.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- ----------------------------------------------------------------
-- Tabla: empresas (Clientes / EESS registrados)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `empresas` (
  `id_empresa`       INT NOT NULL AUTO_INCREMENT,
  `razon_social`     VARCHAR(150) NOT NULL,
  `nombre_comercial` VARCHAR(150) DEFAULT NULL,
  `ruc`              VARCHAR(20) DEFAULT NULL,
  `responsable`      VARCHAR(100) DEFAULT NULL,
  `email`            VARCHAR(100) DEFAULT NULL,
  `telefono`         VARCHAR(30) DEFAULT NULL,
  `direccion`        VARCHAR(255) DEFAULT NULL,
  `ciudad`           VARCHAR(80) DEFAULT NULL,
  `estado`           ENUM('Activo','Suspendido','Inactivo') DEFAULT 'Activo',
  `notas`            TEXT DEFAULT NULL,
  `fecha_registro`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------
-- Tabla: licencias (Licencias generadas por empresa)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `licencias` (
  `id_licencia`      INT NOT NULL AUTO_INCREMENT,
  `id_empresa`       INT NOT NULL,
  `clave_licencia`   VARCHAR(128) NOT NULL UNIQUE,
  `tipo_periodo`     ENUM('demo','mensual','trimestral','semestral','anual') NOT NULL DEFAULT 'mensual',
  `cantidad_periodo` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `fecha_inicio`     DATE NOT NULL,
  `fecha_fin`        DATE NOT NULL,
  `precio`           DECIMAL(10,2) DEFAULT 0.00,
  `estado`           ENUM('Pendiente','Activa','Vencida','Revocada','Suspendida') DEFAULT 'Pendiente',
  `notas`            TEXT DEFAULT NULL,
  `creado_en`        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_licencia`),
  FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------
-- Tabla: activaciones (Historial: cuándo y desde dónde se activó)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activaciones` (
  `id_activacion`    INT NOT NULL AUTO_INCREMENT,
  `id_licencia`      INT NOT NULL,
  `fecha_activacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ip_activacion`    VARCHAR(45) DEFAULT NULL,
  `servidor_info`    VARCHAR(255) DEFAULT NULL,
  `observacion`      VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_activacion`),
  FOREIGN KEY (`id_licencia`) REFERENCES `licencias` (`id_licencia`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------
-- Tabla: pagos_licencia (Control financiero de licencias)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pagos_licencia` (
  `id_pago`          INT NOT NULL AUTO_INCREMENT,
  `id_licencia`      INT NOT NULL,
  `monto`            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `moneda`           VARCHAR(5) DEFAULT 'PEN',
  `metodo_pago`      VARCHAR(50) DEFAULT NULL,
  `referencia`       VARCHAR(100) DEFAULT NULL,
  `estado_pago`      ENUM('Pendiente','Pagado','Anulado') DEFAULT 'Pendiente',
  `fecha_pago`       DATETIME DEFAULT CURRENT_TIMESTAMP,
  `observaciones`    TEXT DEFAULT NULL,
  `registrado_por`   INT DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  FOREIGN KEY (`id_licencia`) REFERENCES `licencias` (`id_licencia`) ON DELETE CASCADE,
  FOREIGN KEY (`registrado_por`) REFERENCES `admin_licencias` (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
