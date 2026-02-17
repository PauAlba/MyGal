/**
 * Controlador de Usuario
 * CRUD y perfil de usuario
 */

const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');
const { validationResult } = require('express-validator');

/**
 * GET /api/usuarios/:id
 * Obtener perfil público de un usuario (obras y colecciones)
 */
async function obtenerPerfil(req, res, next) {
    try {
        const id_usuario = parseInt(req.params.id);
        if (isNaN(id_usuario)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const usuario = await usuarioModel.obtenerPorId(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const obras = await usuarioModel.obtenerObras(id_usuario);
        const colecciones = await usuarioModel.obtenerColecciones(id_usuario);

        res.json({
            usuario,
            obras,
            colecciones
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/usuarios/perfil
 * Editar perfil del usuario autenticado
 */
async function editarPerfil(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const id_usuario = req.usuario.id_usuario;
        const { nombre, username, correo, descripcion, contraseña } = req.body;

        const datos = {};
        if (nombre !== undefined) datos.nombre = nombre;
        if (username !== undefined) datos.username = username;
        if (correo !== undefined) datos.correo = correo;
        if (descripcion !== undefined) datos.descripcion = descripcion;

        // Si se proporciona nueva contraseña, encriptarla
        if (contraseña && contraseña.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            datos.contraseña = await bcrypt.hash(contraseña, salt);
        }

        const actualizado = await usuarioModel.actualizar(id_usuario, datos);
        if (!actualizado) {
            return res.status(400).json({ error: 'No se pudo actualizar el perfil' });
        }

        const usuario = await usuarioModel.obtenerPorId(id_usuario);
        const { contraseña: _, ...usuarioSinPassword } = usuario;
        res.json({ mensaje: 'Perfil actualizado', usuario: usuarioSinPassword });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/usuarios/cuenta
 * Eliminar cuenta del usuario autenticado
 */
async function eliminarCuenta(req, res, next) {
    try {
        const id_usuario = req.usuario.id_usuario;

        const eliminado = await usuarioModel.eliminar(id_usuario);
        if (!eliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Cuenta eliminada correctamente' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    obtenerPerfil,
    editarPerfil,
    eliminarCuenta
};
