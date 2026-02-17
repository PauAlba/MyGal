/**
 * Rutas de usuario
 * /api/usuarios
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware } = require('../middlewares/auth');
const { editarPerfilValidator } = require('../validators/usuarioValidator');

// Rutas específicas deben ir antes de /:id
router.put('/perfil', authMiddleware, editarPerfilValidator, usuarioController.editarPerfil);
router.delete('/cuenta', authMiddleware, usuarioController.eliminarCuenta);

// GET /api/usuarios/:id - Perfil público (no requiere auth)
router.get('/:id', usuarioController.obtenerPerfil);

module.exports = router;
