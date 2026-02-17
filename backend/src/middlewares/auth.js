/**
 * Middleware de autenticación JWT
 * Protege rutas que requieren usuario autenticado
 */

const jwt = require('jsonwebtoken');

/**
 * Verifica que el token JWT sea válido y extrae el usuario
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de autenticación requerido' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = decoded; // { id_usuario, username }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado. Inicia sesión nuevamente' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Error en autenticación' });
    }
};

/**
 * Middleware opcional: si hay token lo valida, sino continúa
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = decoded;
        } else {
            req.usuario = null;
        }
        next();
    } catch (error) {
        req.usuario = null;
        next();
    }
};

module.exports = { authMiddleware, optionalAuth };
