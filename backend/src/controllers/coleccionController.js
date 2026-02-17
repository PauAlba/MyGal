/**
 * Controlador de Colección
 * CRUD completo para colecciones
 */

const coleccionModel = require('../models/coleccionModel');
const { validationResult } = require('express-validator');

/**
 * POST /api/colecciones
 * Crear nueva colección
 */
async function crear(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { nombre, descripcion } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const id_coleccion = await coleccionModel.crear({
            nombre,
            descripcion: descripcion || null,
            id_usuario
        });

        const coleccion = await coleccionModel.obtenerPorId(id_coleccion);
        res.status(201).json({ mensaje: 'Colección creada', coleccion });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/colecciones
 * Obtener todas las colecciones del usuario autenticado
 */
async function listar(req, res, next) {
    try {
        const id_usuario = req.usuario.id_usuario;
        const colecciones = await coleccionModel.obtenerPorUsuario(id_usuario);
        res.json({ colecciones });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/colecciones/:id
 * Obtener colección por ID
 */
async function obtenerPorId(req, res, next) {
    try {
        const id_coleccion = parseInt(req.params.id);
        if (isNaN(id_coleccion)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const coleccion = await coleccionModel.obtenerPorId(id_coleccion);
        if (!coleccion) {
            return res.status(404).json({ error: 'Colección no encontrada' });
        }
        res.json({ coleccion });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/colecciones/:id
 * Actualizar colección
 */
async function actualizar(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const id_coleccion = parseInt(req.params.id);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_coleccion)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pertenece = await coleccionModel.perteneceAUsuario(id_coleccion, id_usuario);
        if (!pertenece) {
            return res.status(403).json({ error: 'No tienes permiso para editar esta colección' });
        }

        const { nombre, descripcion } = req.body;
        const actualizado = await coleccionModel.actualizar(id_coleccion, id_usuario, {
            nombre,
            descripcion
        });

        if (!actualizado) {
            return res.status(400).json({ error: 'No se pudo actualizar' });
        }

        const coleccion = await coleccionModel.obtenerPorId(id_coleccion);
        res.json({ mensaje: 'Colección actualizada', coleccion });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/colecciones/:id
 * Eliminar colección
 */
async function eliminar(req, res, next) {
    try {
        const id_coleccion = parseInt(req.params.id);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_coleccion)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pertenece = await coleccionModel.perteneceAUsuario(id_coleccion, id_usuario);
        if (!pertenece) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta colección' });
        }

        const eliminado = await coleccionModel.eliminar(id_coleccion, id_usuario);
        if (!eliminado) {
            return res.status(404).json({ error: 'Colección no encontrada' });
        }

        res.json({ mensaje: 'Colección eliminada correctamente' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
};
