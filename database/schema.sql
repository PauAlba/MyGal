-- ============================================
-- Galería de Arte - Esquema de Base de Datos
-- Base de datos: galeria_arte
-- ============================================

CREATE DATABASE IF NOT EXISTS galeria_arte;
USE galeria_arte;

-- --------------------------------------------------------
-- TABLA: usuario
-- Almacena información de los usuarios/artistas registrados
-- --------------------------------------------------------
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsqueda por username
CREATE INDEX idx_usuario_username ON usuario(username);

-- --------------------------------------------------------
-- TABLA: coleccion
-- Colecciones de obras creadas por cada usuario
-- Relación: 1 usuario -> muchas colecciones
-- --------------------------------------------------------
CREATE TABLE coleccion (
    id_coleccion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    
    CONSTRAINT fk_coleccion_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX idx_coleccion_nombre ON coleccion(nombre);

-- --------------------------------------------------------
-- TABLA: obra
-- Obras de arte publicadas por los usuarios
-- Relación: 1 usuario -> muchas obras
-- Relación: 1 colección (opcional) -> muchas obras
-- --------------------------------------------------------
CREATE TABLE obra (
    id_obra INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255) NOT NULL,
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_coleccion INT NULL,

    CONSTRAINT fk_obra_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_obra_coleccion
    FOREIGN KEY (id_coleccion)
    REFERENCES coleccion(id_coleccion)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE INDEX idx_obra_titulo ON obra(titulo);

-- --------------------------------------------------------
-- TABLA: like_obra
-- Sistema de likes: usuarios pueden dar like a obras
-- Un usuario no puede dar like dos veces a la misma obra
-- --------------------------------------------------------
CREATE TABLE like_obra (
    id_like INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_obra INT NOT NULL,
    fecha_like DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_like_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,

    CONSTRAINT fk_like_obra
    FOREIGN KEY (id_obra)
    REFERENCES obra(id_obra)
    ON DELETE CASCADE,

    CONSTRAINT unique_like UNIQUE (id_usuario, id_obra)
);
