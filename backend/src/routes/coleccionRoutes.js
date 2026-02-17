/**
 * Rutas de colecciones
 * /api/colecciones
 */

const express = require('express');
const router = express.Router();
const coleccionController = require('../controllers/coleccionController');
const { authMiddleware } = require('../middlewares/auth');
const {
    crearColeccionValidator,
    actualizarColeccionValidator
} = require('../validators/coleccionValidator');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/colecciones
router.get('/', coleccionController.listar);

// GET /api/colecciones/:id
router.get('/:id', coleccionController.obtenerPorId);

// POST /api/colecciones
router.post('/', crearColeccionValidator, coleccionController.crear);

// PUT /api/colecciones/:id
router.put('/:id', actualizarColeccionValidator, coleccionController.actualizar);

// DELETE /api/colecciones/:id
router.delete('/:id', coleccionController.eliminar);

module.exports = router;
