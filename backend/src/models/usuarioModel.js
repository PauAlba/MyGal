/**
 * Modelo de Usuario
 * CRUD completo para la entidad usuario
 */

const { pool } = require('../config/db');

/**
 * Crear nuevo usuario
 */
async function crear(usuario) {
    const [result] = await pool.execute(
        'INSERT INTO usuario (nombre, username, correo, contraseña, descripcion) VALUES (?, ?, ?, ?, ?)',
        [
            usuario.nombre,
            usuario.username,
            usuario.correo,
            usuario.contraseña,
            usuario.descripcion || null
        ]
    );
    return result.insertId;
}

/**
 * Buscar usuario por ID
 */
async function obtenerPorId(id_usuario) {
    const [rows] = await pool.execute(
        'SELECT id_usuario, nombre, username, correo, descripcion, fecha_registro FROM usuario WHERE id_usuario = ?',
        [id_usuario]
    );
    return rows[0] || null;
}

/**
 * Buscar usuario por username (incluye contraseña para login)
 */
async function obtenerPorUsername(username) {
    const [rows] = await pool.execute(
        'SELECT * FROM usuario WHERE username = ?',
        [username]
    );
    return rows[0] || null;
}

/**
 * Buscar usuario por correo
 */
async function obtenerPorCorreo(correo) {
    const [rows] = await pool.execute(
        'SELECT * FROM usuario WHERE correo = ?',
        [correo]
    );
    return rows[0] || null;
}

/**
 * Actualizar usuario
 */
async function actualizar(id_usuario, datos) {
    const campos = [];
    const valores = [];

    if (datos.nombre !== undefined) { campos.push('nombre = ?'); valores.push(datos.nombre); }
    if (datos.username !== undefined) { campos.push('username = ?'); valores.push(datos.username); }
    if (datos.correo !== undefined) { campos.push('correo = ?'); valores.push(datos.correo); }
    if (datos.descripcion !== undefined) { campos.push('descripcion = ?'); valores.push(datos.descripcion); }
    if (datos.contraseña !== undefined) { campos.push('contraseña = ?'); valores.push(datos.contraseña); }

    if (campos.length === 0) return false;

    valores.push(id_usuario);
    const [result] = await pool.execute(
        `UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`,
        valores
    );
    return result.affectedRows > 0;
}

/**
 * Eliminar usuario
 */
async function eliminar(id_usuario) {
    const [result] = await pool.execute('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]);
    return result.affectedRows > 0;
}

/**
 * Obtener obras de un usuario
 */
async function obtenerObras(id_usuario) {
    const [rows] = await pool.execute(
        `SELECT o.*, u.nombre as autor_nombre, u.username as autor_username,
         (SELECT COUNT(*) FROM like_obra WHERE id_obra = o.id_obra) as likes_count
         FROM obra o
         JOIN usuario u ON o.id_usuario = u.id_usuario
         WHERE o.id_usuario = ? ORDER BY o.fecha_subida DESC`,
        [id_usuario]
    );
    return rows;
}

/**
 * Obtener colecciones de un usuario
 */
async function obtenerColecciones(id_usuario) {
    const [rows] = await pool.execute(
        'SELECT * FROM coleccion WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
        [id_usuario]
    );
    return rows;
}

module.exports = {
    crear,
    obtenerPorId,
    obtenerPorUsername,
    obtenerPorCorreo,
    actualizar,
    eliminar,
    obtenerObras,
    obtenerColecciones
};
