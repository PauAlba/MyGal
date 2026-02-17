/**
 * Rutas de autenticación
 * /api/auth
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/auth');
const { registroValidator, loginValidator } = require('../validators/authValidator');

// POST /api/auth/registro
router.post('/registro', registroValidator, authController.registro);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

// GET /api/auth/verificar (requiere autenticación)
router.get('/verificar', authMiddleware, authController.verificar);

module.exports = router;
