/**
 * Modelo de Colección
 * CRUD completo para la entidad coleccion
 */

const { pool } = require('../config/db');

/**
 * Crear nueva colección
 */
async function crear(coleccion) {
    const [result] = await pool.execute(
        'INSERT INTO coleccion (nombre, descripcion, id_usuario) VALUES (?, ?, ?)',
        [coleccion.nombre, coleccion.descripcion || null, coleccion.id_usuario]
    );
    return result.insertId;
}

/**
 * Obtener colección por ID
 */
async function obtenerPorId(id_coleccion) {
    const [rows] = await pool.execute(
        `SELECT c.*, u.nombre as usuario_nombre, u.username 
         FROM coleccion c 
         JOIN usuario u ON c.id_usuario = u.id_usuario 
         WHERE c.id_coleccion = ?`,
        [id_coleccion]
    );
    return rows[0] || null;
}

/**
 * Obtener todas las colecciones de un usuario
 */
async function obtenerPorUsuario(id_usuario) {
    const [rows] = await pool.execute(
        'SELECT * FROM coleccion WHERE id_usuario = ? ORDER BY fecha_creacion DESC',
        [id_usuario]
    );
    return rows;
}

/**
 * Actualizar colección
 */
async function actualizar(id_coleccion, id_usuario, datos) {
    const [result] = await pool.execute(
        'UPDATE coleccion SET nombre = ?, descripcion = ? WHERE id_coleccion = ? AND id_usuario = ?',
        [
            datos.nombre ?? '',
            datos.descripcion ?? null,
            id_coleccion,
            id_usuario
        ]
    );
    return result.affectedRows > 0;
}

/**
 * Eliminar colección
 */
async function eliminar(id_coleccion, id_usuario) {
    const [result] = await pool.execute(
        'DELETE FROM coleccion WHERE id_coleccion = ? AND id_usuario = ?',
        [id_coleccion, id_usuario]
    );
    return result.affectedRows > 0;
}

/**
 * Verificar que la colección pertenece al usuario
 */
async function perteneceAUsuario(id_coleccion, id_usuario) {
    const [rows] = await pool.execute(
        'SELECT id_coleccion FROM coleccion WHERE id_coleccion = ? AND id_usuario = ?',
        [id_coleccion, id_usuario]
    );
    return rows.length > 0;
}

module.exports = {
    crear,
    obtenerPorId,
    obtenerPorUsuario,
    actualizar,
    eliminar,
    perteneceAUsuario
};
