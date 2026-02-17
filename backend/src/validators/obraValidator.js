/**
 * Validadores para obras
 */

const { body } = require('express-validator');

const crearObraValidator = [
    body('titulo').trim().notEmpty().withMessage('El título es requerido')
        .isLength({ max: 100 }).withMessage('Título máximo 100 caracteres'),
    body('descripcion').optional().trim(),
    body('imagen_url').trim().notEmpty().withMessage('La imagen es requerida (URL o ruta)')
        .isLength({ max: 255 }).withMessage('URL máximo 255 caracteres'),
    body('id_coleccion').optional().isInt().withMessage('id_coleccion debe ser un número entero')
];

const actualizarObraValidator = [
    body('titulo').optional().trim().notEmpty().withMessage('El título no puede estar vacío')
        .isLength({ max: 100 }).withMessage('Título máximo 100 caracteres'),
    body('descripcion').optional().trim(),
    body('imagen_url').optional().trim()
        .isLength({ max: 255 }).withMessage('URL máximo 255 caracteres'),
    body('id_coleccion').optional({ nullable: true }).isInt().withMessage('id_coleccion debe ser un número entero')
];

module.exports = { crearObraValidator, actualizarObraValidator };
