-- ================================================================
-- Agregar a: sistema_citas_medicas_db
-- Tabla de configuración de licencia (solo 1 fila)
-- ================================================================

USE `sistema_citas_medicas_db`;

CREATE TABLE IF NOT EXISTS `licencia_config` (
  `id`               INT NOT NULL DEFAULT 1,
  `clave_licencia`   VARCHAR(128) DEFAULT NULL,
  `empresa_nombre`   VARCHAR(150) DEFAULT NULL,
  `fecha_activacion` DATETIME DEFAULT NULL,
  `fecha_vencimiento` DATE DEFAULT NULL,
  `estado`           ENUM('Activa','Vencida','No activada') DEFAULT 'No activada',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar fila base si no existe
INSERT IGNORE INTO `licencia_config` (`id`) VALUES (1);
