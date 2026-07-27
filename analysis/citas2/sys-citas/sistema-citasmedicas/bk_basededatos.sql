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


-- Volcando estructura de base de datos para sistema_citas_medicas_db
CREATE DATABASE IF NOT EXISTS `sistema_citas_medicas_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_citas_medicas_db`;

-- Volcando estructura para tabla sistema_citas_medicas_db.archivos_paciente
CREATE TABLE IF NOT EXISTS `archivos_paciente` (
  `id_archivo` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `nombre_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ruta_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_archivo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_subida` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_archivo`),
  KEY `id_paciente` (`id_paciente`),
  CONSTRAINT `archivos_paciente_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.archivos_paciente: ~0 rows (aproximadamente)
DELETE FROM `archivos_paciente`;

-- Volcando estructura para tabla sistema_citas_medicas_db.auditoria
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tabla_afectada` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_registro_afectado` int DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `ip_usuario` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.auditoria: ~0 rows (aproximadamente)
DELETE FROM `auditoria`;

-- Volcando estructura para tabla sistema_citas_medicas_db.citas
CREATE TABLE IF NOT EXISTS `citas` (
  `id_cita` int NOT NULL AUTO_INCREMENT,
  `id_paciente` int NOT NULL,
  `id_medico` int NOT NULL,
  `id_servicio` int DEFAULT NULL,
  `fecha_cita` datetime NOT NULL,
  `motivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `peso` decimal(5,2) DEFAULT NULL,
  `talla` decimal(5,2) DEFAULT NULL,
  `temperatura` decimal(4,1) DEFAULT NULL,
  `presion_arterial` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diagnostico` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `prescripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `dias_reposo` int DEFAULT '0',
  `fecha_fin_reposo` date DEFAULT NULL,
  `estado` enum('Pendiente','Confirmada','Cancelada','Finalizada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fc` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fr` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sat_o2` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tiempo_enfermedad` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `motivo_consulta` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `enfermedad_actual` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `antecedentes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `examen_fisico` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `examenes_auxiliares` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `tratamiento` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_control` date DEFAULT NULL,
  `id_interconsulta_especialidad` int DEFAULT NULL,
  PRIMARY KEY (`id_cita`),
  KEY `id_paciente` (`id_paciente`),
  KEY `id_medico` (`id_medico`),
  KEY `fk_cita_servicio` (`id_servicio`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`),
  CONSTRAINT `fk_cita_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.citas: ~0 rows (aproximadamente)
DELETE FROM `citas`;

-- Volcando estructura para tabla sistema_citas_medicas_db.configuracion
CREATE TABLE IF NOT EXISTS `configuracion` (
  `id` int NOT NULL,
  `nombre_clinica` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `moneda` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'S/.',
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.configuracion: ~0 rows (aproximadamente)
DELETE FROM `configuracion`;
INSERT INTO `configuracion` (`id`, `nombre_clinica`, `direccion`, `telefono`, `email`, `moneda`, `logo`) VALUES
	(1, 'Centro Médico Salud', 'Av. Principal 123, Lima', '(01) 555-0000', 'contacto@saludtotal.com', 'S/', 'logo_clinica_1772176162.png');

-- Volcando estructura para tabla sistema_citas_medicas_db.especialidades
CREATE TABLE IF NOT EXISTS `especialidades` (
  `id_especialidad` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_especialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.especialidades: ~0 rows (aproximadamente)
DELETE FROM `especialidades`;

-- Volcando estructura para tabla sistema_citas_medicas_db.gastos
CREATE TABLE IF NOT EXISTS `gastos` (
  `id_gasto` int NOT NULL AUTO_INCREMENT,
  `id_sesion` int NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_gasto` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_gasto`),
  KEY `id_sesion` (`id_sesion`),
  CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`id_sesion`) REFERENCES `sesiones_caja` (`id_sesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.gastos: ~0 rows (aproximadamente)
DELETE FROM `gastos`;

-- Volcando estructura para tabla sistema_citas_medicas_db.horarios_medicos
CREATE TABLE IF NOT EXISTS `horarios_medicos` (
  `id_horario` int NOT NULL AUTO_INCREMENT,
  `id_medico` int NOT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_especifica` date DEFAULT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  PRIMARY KEY (`id_horario`),
  KEY `id_medico` (`id_medico`),
  CONSTRAINT `horarios_medicos_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medicos` (`id_medico`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.horarios_medicos: ~0 rows (aproximadamente)
DELETE FROM `horarios_medicos`;

-- Volcando estructura para tabla sistema_citas_medicas_db.interconsultas
CREATE TABLE IF NOT EXISTS `interconsultas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cita` int NOT NULL,
  `id_especialidad` int NOT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `id_cita` (`id_cita`),
  KEY `id_especialidad` (`id_especialidad`),
  CONSTRAINT `interconsultas_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`) ON DELETE CASCADE,
  CONSTRAINT `interconsultas_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.interconsultas: ~0 rows (aproximadamente)
DELETE FROM `interconsultas`;

-- Volcando estructura para tabla sistema_citas_medicas_db.licencia_config
CREATE TABLE IF NOT EXISTS `licencia_config` (
  `id` int NOT NULL DEFAULT '1',
  `clave_licencia` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `empresa_nombre` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_activacion` datetime DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('Activa','Vencida','No activada','Suspendida','Revocada') COLLATE utf8mb4_general_ci DEFAULT 'No activada',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.licencia_config: ~0 rows (aproximadamente)
DELETE FROM `licencia_config`;
INSERT INTO `licencia_config` (`id`, `clave_licencia`, `empresa_nombre`, `fecha_activacion`, `fecha_vencimiento`, `estado`) VALUES
	(1, 'f2677049cb8c0bbe24b0e14e07dad993c75a12f6aaac26cdadedea18c0c7dde6', 'EMPRESA 1', '2026-03-26 23:16:26', '2026-09-26', 'Activa');

-- Volcando estructura para tabla sistema_citas_medicas_db.medicamentos
CREATE TABLE IF NOT EXISTS `medicamentos` (
  `id_medicamento` int NOT NULL AUTO_INCREMENT,
  `nombre_comercial` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombre_generico` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `presentacion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock` int DEFAULT '0',
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_medicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.medicamentos: ~0 rows (aproximadamente)
DELETE FROM `medicamentos`;

-- Volcando estructura para tabla sistema_citas_medicas_db.medicos
CREATE TABLE IF NOT EXISTS `medicos` (
  `id_medico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_especialidad` int NOT NULL,
  `colegiatura` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_medico`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_especialidad` (`id_especialidad`),
  CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `medicos_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.medicos: ~0 rows (aproximadamente)
DELETE FROM `medicos`;

-- Volcando estructura para tabla sistema_citas_medicas_db.pagos
CREATE TABLE IF NOT EXISTS `pagos` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_cita` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  KEY `id_cita` (`id_cita`),
  CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.pagos: ~0 rows (aproximadamente)
DELETE FROM `pagos`;

-- Volcando estructura para tabla sistema_citas_medicas_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.roles: ~4 rows (aproximadamente)
DELETE FROM `roles`;
INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
	(1, 'Administrador'),
	(2, 'Medico'),
	(3, 'Paciente'),
	(4, 'Recepcionista');

-- Volcando estructura para tabla sistema_citas_medicas_db.servicios
CREATE TABLE IF NOT EXISTS `servicios` (
  `id_servicio` int NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `precio` decimal(10,2) NOT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Activo',
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.servicios: ~0 rows (aproximadamente)
DELETE FROM `servicios`;

-- Volcando estructura para tabla sistema_citas_medicas_db.sesiones_caja
CREATE TABLE IF NOT EXISTS `sesiones_caja` (
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto_apertura` decimal(10,2) NOT NULL,
  `monto_cierre` decimal(10,2) DEFAULT NULL,
  `fecha_apertura` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_cierre` datetime DEFAULT NULL,
  `estado` enum('abierta','cerrada') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'abierta',
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_sesion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.sesiones_caja: ~0 rows (aproximadamente)
DELETE FROM `sesiones_caja`;

-- Volcando estructura para tabla sistema_citas_medicas_db.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `documento_identidad` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `grupo_sanguineo` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alergias` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `enfermedades_cronicas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('M','F','Otro') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `persona_responsable` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tel_responsable` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nro_historia_clinica` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla sistema_citas_medicas_db.usuarios: ~1 rows (aproximadamente)
DELETE FROM `usuarios`;
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `documento_identidad`, `email`, `telefono`, `grupo_sanguineo`, `alergias`, `enfermedades_cronicas`, `password`, `avatar`, `id_rol`, `estado`, `fecha_creacion`, `fecha_nacimiento`, `sexo`, `persona_responsable`, `tel_responsable`, `nro_historia_clinica`) VALUES
	(3, 'Administrador Principal', NULL, 'admin@medico.com', NULL, NULL, NULL, NULL, '$2y$10$4b1F8dm6AbyBMzb5lfjEe.5fqJbN11cn5p.kHtki4xZCggDtQxQlm', NULL, 1, 1, '2025-11-29 14:40:16', NULL, NULL, NULL, NULL, NULL),
	(4, 'RECEPCIONISTA 1', NULL, 'recepcionista1@correo.com', '90909090', NULL, NULL, NULL, '$2y$10$8M77WEXrbUIaamwP7gY5MO7ftjVJVS9CoC0G9fZciqics7n/1w9Am', NULL, 4, 1, '2026-03-27 04:32:37', NULL, NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
