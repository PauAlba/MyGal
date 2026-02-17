/**
 * Controlador de Autenticación
 * Registro, login y gestión de sesión con JWT
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { validationResult } = require('express-validator');

/**
 * POST /api/auth/registro
 * Registra un nuevo usuario
 */
async function registro(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { nombre, username, correo, contraseña, descripcion } = req.body;

        // Verificar que username no exista
        const existeUsername = await usuarioModel.obtenerPorUsername(username);
        if (existeUsername) {
            return res.status(400).json({ error: 'El username ya está en uso' });
        }

        // Verificar que correo no exista
        const existeCorreo = await usuarioModel.obtenerPorCorreo(correo);
        if (existeCorreo) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        // Encriptar contraseña con bcrypt
        const salt = await bcrypt.genSalt(10);
        const contraseñaHash = await bcrypt.hash(contraseña, salt);

        const id_usuario = await usuarioModel.crear({
            nombre,
            username,
            correo,
            contraseña: contraseñaHash,
            descripcion: descripcion || null
        });

        // Generar JWT
        const token = jwt.sign(
            { id_usuario, username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        const usuario = await usuarioModel.obtenerPorId(id_usuario);
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            token,
            usuario
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/login
 * Inicia sesión y devuelve JWT
 */
async function login(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { username, contraseña } = req.body;

        const usuario = await usuarioModel.obtenerPorUsername(username);
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // No enviar contraseña al cliente
        const { contraseña: _, ...usuarioSinPassword } = usuario;

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: usuarioSinPassword
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/verificar
 * Verifica el token y devuelve datos del usuario
 */
async function verificar(req, res) {
    const usuario = await usuarioModel.obtenerPorId(req.usuario.id_usuario);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const { contraseña: _, ...usuarioSinPassword } = usuario;
    res.json({ usuario: usuarioSinPassword });
}

module.exports = {
    registro,
    login,
    verificar
};
