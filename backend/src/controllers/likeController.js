/**
 * Controlador de Like
 * Dar y quitar like a obras
 */

const likeModel = require('../models/likeModel');
const obraModel = require('../models/obraModel');

/**
 * POST /api/likes/:id_obra
 * Dar like a una obra
 */
async function darLike(req, res, next) {
    try {
        const id_obra = parseInt(req.params.id_obra);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID de obra inválido' });
        }

        // Verificar que la obra existe
        const obra = await obraModel.obtenerPorId(id_obra);
        if (!obra) {
            return res.status(404).json({ error: 'Obra no encontrada' });
        }

        // Un usuario no puede dar like dos veces
        const yaDioLike = await likeModel.usuarioDioLike(id_usuario, id_obra);
        if (yaDioLike) {
            return res.status(400).json({ error: 'Ya diste like a esta obra' });
        }

        await likeModel.crear(id_usuario, id_obra);
        const likesCount = await likeModel.contarPorObra(id_obra);

        res.status(201).json({
            mensaje: 'Like agregado',
            likes_count: likesCount
        });
    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/likes/:id_obra
 * Quitar like de una obra
 */
async function quitarLike(req, res, next) {
    try {
        const id_obra = parseInt(req.params.id_obra);
        const id_usuario = req.usuario.id_usuario;

        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID de obra inválido' });
        }

        const eliminado = await likeModel.eliminar(id_usuario, id_obra);
        if (!eliminado) {
            return res.status(404).json({ error: 'No habías dado like a esta obra' });
        }

        const likesCount = await likeModel.contarPorObra(id_obra);

        res.json({
            mensaje: 'Like eliminado',
            likes_count: likesCount
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/likes/:id_obra
 * Verificar si el usuario dio like y obtener contador
 */
async function estado(req, res, next) {
    try {
        const id_obra = parseInt(req.params.id_obra);

        if (isNaN(id_obra)) {
            return res.status(400).json({ error: 'ID de obra inválido' });
        }

        const dioLike = await likeModel.usuarioDioLike(req.usuario.id_usuario, id_obra);
        const likes_count = await likeModel.contarPorObra(id_obra);

        res.json({ dioLike, likes_count });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    darLike,
    quitarLike,
    estado
};
