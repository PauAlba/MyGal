/**
 * Controlador de Obra
 * CRUD completo para obras + búsqueda
 */

const obraModel = require('../models/obraModel');
const likeModel = require('../models/likeModel');
const { validationResult } = require('express-validator');

/**
 * POST /api/obras
 * Subir nueva obra
 */
async function crear(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { titulo, descripcion, imagen_url, id_coleccion } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const id_obra = await obraModel.crear({
            titulo,
            descripcion: descripcion || null,
            imagen_url: imagen_url || req.file?.path || req.body.imagen_url,
            id_usuario,
            id_coleccion: id_coleccion || null
        });

        const obra = await obraModel.obtenerPorId(id_obra);
        res.status(201).json({ mensaje: 'Obra publicada', obra });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/obras
 * Listar todas las obras públicas (con paginación)
 */
async function listar(req, res, next) {
    try {
        const limite = parseInt(req.query.limite) || 50;
        const offset = parseInt(req.query.offset) || 0;

        const obras = await obraModel.listarTodas(limite, offset);
        res.json({ obras });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/obras/buscar?q=
 * Buscar obras por título
 */
async function buscar(req, res, next) {
    try {
        const titulo = req.query.q || '';
        if (titulo.trim() === '') {
            return res.json({ obras: [] });
        }

        const obras = await obraModel.buscarPorTitulo(titulo.trim());
        res.json({ obras });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/obras/:id
 * Obtener obra individual (incluye si el usuario actual dio like)
 */
async function obtenerPorId(req, res, next) {
    try {
        const id_obra = parseInt(req.params.id);
        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const obra = await obraModel.obtenerPorId(id_obra);
        if (!obra) {
            return res.status(404).json({ error: 'Obra no encontrada' });
        }

        // Si hay usuario autenticado, verificar si dio like
        let dioLike = false;
        if (req.usuario) {
            dioLike = await likeModel.usuarioDioLike(req.usuario.id_usuario, id_obra);
        }

        res.json({ obra: { ...obra, dioLike } });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/obras/:id
 * Actualizar obra
 */
async function actualizar(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const id_obra = parseInt(req.params.id);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pertenece = await obraModel.perteneceAUsuario(id_obra, id_usuario);
        if (!pertenece) {
            return res.status(403).json({ error: 'No tienes permiso para editar esta obra' });
        }

        const { titulo, descripcion, imagen_url, id_coleccion } = req.body;
        const datos = {};
        if (titulo !== undefined) datos.titulo = titulo;
        if (descripcion !== undefined) datos.descripcion = descripcion;
        if (imagen_url !== undefined) datos.imagen_url = imagen_url;
        if (id_coleccion !== undefined) datos.id_coleccion = id_coleccion;

        const actualizado = await obraModel.actualizar(id_obra, id_usuario, datos);
        if (!actualizado) {
            return res.status(400).json({ error: 'No se pudo actualizar' });
        }

        const obra = await obraModel.obtenerPorId(id_obra);
        res.json({ mensaje: 'Obra actualizada', obra });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/obras/:id
 * Eliminar obra
 */
async function eliminar(req, res, next) {
    try {
        const id_obra = parseInt(req.params.id);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const pertenece = await obraModel.perteneceAUsuario(id_obra, id_usuario);
        if (!pertenece) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta obra' });
        }

        const eliminado = await obraModel.eliminar(id_obra, id_usuario);
        if (!eliminado) {
            return res.status(404).json({ error: 'Obra no encontrada' });
        }

        res.json({ mensaje: 'Obra eliminada correctamente' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crear,
    listar,
    buscar,
    obtenerPorId,
    actualizar,
    eliminar
};
