/**
 * Manejo centralizado de errores
 * Captura errores y devuelve respuestas HTTP apropiadas
 */

/**
 * Middleware de manejo de errores
 * Debe ser el último middleware definido
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Errores de validación (express-validator)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    // Error de MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El registro ya existe (username o correo duplicado)' });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(404).json({ error: 'Recurso referenciado no encontrado' });
    }

    // Error por defecto
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : err.message;

    res.status(statusCode).json({ error: message });
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFound = (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
};

module.exports = { errorHandler, notFound };
