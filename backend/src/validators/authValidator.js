/**
 * Validadores para autenticación
 */

const { body } = require('express-validator');

const registroValidator = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('username').trim().notEmpty().withMessage('El username es requerido')
        .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guión bajo'),
    body('correo').trim().notEmpty().withMessage('El correo es requerido')
        .isEmail().withMessage('Correo inválido'),
    body('contraseña').notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('descripcion').optional().trim()
];

const loginValidator = [
    body('username').trim().notEmpty().withMessage('El username es requerido'),
    body('contraseña').notEmpty().withMessage('La contraseña es requerida')
];

module.exports = { registroValidator, loginValidator };
