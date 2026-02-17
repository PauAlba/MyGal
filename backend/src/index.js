/**
 * Galería de Arte - Backend API
 * Servidor Express principal
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const coleccionRoutes = require('./routes/coleccionRoutes');
const obraRoutes = require('./routes/obraRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API REST
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/colecciones', coleccionRoutes);
app.use('/api/obras', obraRoutes);
app.use('/api/likes', likeRoutes);

// Ruta de salud
app.get('/api', (req, res) => {
    res.json({
        mensaje: 'Galería de Arte API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            colecciones: '/api/colecciones',
            obras: '/api/obras',
            likes: '/api/likes'
        }
    });
});

// Manejo de rutas no encontradas (404)
app.use(notFound);

// Manejo centralizado de errores
app.use(errorHandler);

// Iniciar servidor
async function start() {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`✓ Servidor Express corriendo en http://localhost:${PORT}`);
    });
}

start().catch(err => {
    console.error('Error al iniciar:', err);
    process.exit(1);
});
