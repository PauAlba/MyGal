/**
 * Modelo de Obra
 * CRUD completo para la entidad obra
 */

const { pool } = require('../config/db');

/**
 * Crear nueva obra
 */
async function crear(obra) {
    const [result] = await pool.execute(
        'INSERT INTO obra (titulo, descripcion, imagen_url, id_usuario, id_coleccion) VALUES (?, ?, ?, ?, ?)',
        [
            obra.titulo,
            obra.descripcion || null,
            obra.imagen_url,
            obra.id_usuario,
            obra.id_coleccion || null
        ]
    );
    return result.insertId;
}

/**
 * Obtener obra por ID con información del autor y contador de likes
 */
async function obtenerPorId(id_obra) {
    const [rows] = await pool.execute(
        `SELECT o.*, u.nombre as autor_nombre, u.username as autor_username,
         (SELECT COUNT(*) FROM like_obra WHERE id_obra = o.id_obra) as likes_count
         FROM obra o
         JOIN usuario u ON o.id_usuario = u.id_usuario
         WHERE o.id_obra = ?`,
        [id_obra]
    );
    return rows[0] || null;
}

/**
 * Listar todas las obras públicas (ordenadas por fecha)
 * Nota: LIMIT/OFFSET como literales (enteros validados) - mysql2 falla con placeholders aquí
 */
async function listarTodas(limite = 50, offset = 0) {
    const lim = Math.floor(Number(limite)) || 50;
    const off = Math.floor(Number(offset)) || 0;
    const [rows] = await pool.execute(
        `SELECT o.*, u.nombre as autor_nombre, u.username as autor_username,
         (SELECT COUNT(*) FROM like_obra WHERE id_obra = o.id_obra) as likes_count
         FROM obra o
         JOIN usuario u ON o.id_usuario = u.id_usuario
         ORDER BY o.fecha_subida DESC
         LIMIT ${lim} OFFSET ${off}`
    );
    return rows;
}

/**
 * Buscar obras por título
 */
async function buscarPorTitulo(titulo, limite = 50) {
    const lim = Math.floor(Number(limite)) || 50;
    const [rows] = await pool.execute(
        `SELECT o.*, u.nombre as autor_nombre, u.username as autor_username,
         (SELECT COUNT(*) FROM like_obra WHERE id_obra = o.id_obra) as likes_count
         FROM obra o
         JOIN usuario u ON o.id_usuario = u.id_usuario
         WHERE o.titulo LIKE ?
         ORDER BY o.fecha_subida DESC
         LIMIT ${lim}`,
        [`%${titulo}%`]
    );
    return rows;
}

/**
 * Actualizar obra
 */
async function actualizar(id_obra, id_usuario, datos) {
    const campos = [];
    const valores = [];

    if (datos.titulo !== undefined) { campos.push('titulo = ?'); valores.push(datos.titulo); }
    if (datos.descripcion !== undefined) { campos.push('descripcion = ?'); valores.push(datos.descripcion); }
    if (datos.imagen_url !== undefined) { campos.push('imagen_url = ?'); valores.push(datos.imagen_url); }
    if (datos.id_coleccion !== undefined) { campos.push('id_coleccion = ?'); valores.push(datos.id_coleccion); }

    if (campos.length === 0) return false;

    valores.push(id_obra, id_usuario);
    const [result] = await pool.execute(
        `UPDATE obra SET ${campos.join(', ')} WHERE id_obra = ? AND id_usuario = ?`,
        valores
    );
    return result.affectedRows > 0;
}

/**
 * Eliminar obra
 */
async function eliminar(id_obra, id_usuario) {
    const [result] = await pool.execute(
        'DELETE FROM obra WHERE id_obra = ? AND id_usuario = ?',
        [id_obra, id_usuario]
    );
    return result.affectedRows > 0;
}

/**
 * Verificar que la obra pertenece al usuario
 */
async function perteneceAUsuario(id_obra, id_usuario) {
    const [rows] = await pool.execute(
        'SELECT id_obra FROM obra WHERE id_obra = ? AND id_usuario = ?',
        [id_obra, id_usuario]
    );
    return rows.length > 0;
}

module.exports = {
    crear,
    obtenerPorId,
    listarTodas,
    buscarPorTitulo,
    actualizar,
    eliminar,
    perteneceAUsuario
};
