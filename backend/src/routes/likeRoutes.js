/**
 * Rutas de likes
 * /api/likes
 */

const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authMiddleware } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/likes/:id_obra - Dar like
router.post('/:id_obra', likeController.darLike);

// DELETE /api/likes/:id_obra - Quitar like
router.delete('/:id_obra', likeController.quitarLike);

// GET /api/likes/:id_obra - Estado de like del usuario
router.get('/:id_obra', likeController.estado);

module.exports = router;
