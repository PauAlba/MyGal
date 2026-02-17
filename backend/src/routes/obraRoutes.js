/**
 * Rutas de obras
 * /api/obras
 */

const express = require('express');
const router = express.Router();
const obraController = require('../controllers/obraController');
const { authMiddleware, optionalAuth } = require('../middlewares/auth');
const { crearObraValidator, actualizarObraValidator } = require('../validators/obraValidator');

// GET /api/obras - Listar todas (público)
router.get('/', obraController.listar);

// GET /api/obras/buscar?q= - Buscar por título (público)
router.get('/buscar', obraController.buscar);

// GET /api/obras/:id - Obtener obra individual (público, optionalAuth para saber si dio like)
router.get('/:id', optionalAuth, obraController.obtenerPorId);

// Rutas protegidas
router.post('/', authMiddleware, crearObraValidator, obraController.crear);
router.put('/:id', authMiddleware, actualizarObraValidator, obraController.actualizar);
router.delete('/:id', authMiddleware, obraController.eliminar);

module.exports = router;
