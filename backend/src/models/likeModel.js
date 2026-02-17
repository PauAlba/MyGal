/**
 * Modelo de Like
 * Sistema de likes para obras
 */

const { pool } = require('../config/db');

/**
 * Dar like a una obra
 */
async function crear(id_usuario, id_obra) {
    const [result] = await pool.execute(
        'INSERT INTO like_obra (id_usuario, id_obra) VALUES (?, ?)',
        [id_usuario, id_obra]
    );
    return result.insertId;
}

/**
 * Quitar like de una obra
 */
async function eliminar(id_usuario, id_obra) {
    const [result] = await pool.execute(
        'DELETE FROM like_obra WHERE id_usuario = ? AND id_obra = ?',
        [id_usuario, id_obra]
    );
    return result.affectedRows > 0;
}

/**
 * Verificar si el usuario ya dio like a la obra
 */
async function usuarioDioLike(id_usuario, id_obra) {
    const [rows] = await pool.execute(
        'SELECT id_like FROM like_obra WHERE id_usuario = ? AND id_obra = ?',
        [id_usuario, id_obra]
    );
    return rows.length > 0;
}

/**
 * Contar likes de una obra
 */
async function contarPorObra(id_obra) {
    const [rows] = await pool.execute(
        'SELECT COUNT(*) as total FROM like_obra WHERE id_obra = ?',
        [id_obra]
    );
    return rows[0].total;
}

module.exports = {
    crear,
    eliminar,
    usuarioDioLike,
    contarPorObra
};
