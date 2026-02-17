/**
 * Validadores para colecciones
 */

const { body } = require('express-validator');

const crearColeccionValidator = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 100 }).withMessage('Nombre máximo 100 caracteres'),
    body('descripcion').optional().trim()
];

const actualizarColeccionValidator = [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío')
        .isLength({ max: 100 }).withMessage('Nombre máximo 100 caracteres'),
    body('descripcion').optional().trim()
];

module.exports = { crearColeccionValidator, actualizarColeccionValidator };
