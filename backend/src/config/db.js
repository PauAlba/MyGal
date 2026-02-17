/**
 * Configuración de conexión a MySQL usando pool
 * Pool permite reutilizar conexiones y mejorar rendimiento
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'galeria_arte',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

/**
 * Prueba la conexión a la base de datos
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✓ Conexión a MySQL establecida correctamente');
        connection.release();
    } catch (error) {
        console.error('✗ Error al conectar con MySQL:', error.message);
        process.exit(1);
    }
}

module.exports = { pool, testConnection };
