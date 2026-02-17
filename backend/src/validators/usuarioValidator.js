/**
 * Validadores para usuario/perfil
 */

const { body } = require('express-validator');

const editarPerfilValidator = [
    body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('username').optional().trim()
        .isLength({ min: 3, max: 50 }).withMessage('Username debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username solo puede contener letras, números y guión bajo'),
    body('correo').optional().trim().isEmail().withMessage('Correo inválido'),
    body('descripcion').optional().trim(),
    body('contraseña').optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

module.exports = { editarPerfilValidator };
