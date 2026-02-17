/**
 * Módulo de autenticación
 * Manejo de sesión, token y estado del usuario
 */

let currentUser = null;

/**
 * Verifica si hay usuario autenticado (token válido)
 */
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        updateAuthUI(false);
        return null;
    }

    try {
        const data = await authAPI.verificar();
        currentUser = data.usuario;
        updateAuthUI(true);
        return currentUser;
    } catch (e) {
        localStorage.removeItem('token');
        currentUser = null;
        updateAuthUI(false);
        return null;
    }
}

/**
 * Actualiza la UI según el estado de autenticación
 */
function updateAuthUI(isLoggedIn) {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const navPerfil = document.getElementById('navPerfil');
    const navCrear = document.getElementById('navCrear');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (isLoggedIn && currentUser) {
        navAuth.classList.add('hidden');
        navUser.classList.remove('hidden');
        navPerfil.classList.remove('hidden');
        navCrear.classList.remove('hidden');
        usernameDisplay.textContent = `@${currentUser.username}`;
    } else {
        navAuth.classList.remove('hidden');
        navUser.classList.add('hidden');
        navPerfil.classList.add('hidden');
        navCrear.classList.add('hidden');
    }
}

/**
 * Login
 */
async function login(username, contraseña) {
    const data = await authAPI.login(username, contraseña);
    localStorage.setItem('token', data.token);
    currentUser = data.usuario;
    updateAuthUI(true);
    return data;
}

/**
 * Registro
 */
async function registro(datos) {
    const data = await authAPI.registro(datos);
    localStorage.setItem('token', data.token);
    currentUser = data.usuario;
    updateAuthUI(true);
    return data;
}

/**
 * Logout
 */
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    updateAuthUI(false);
}

/**
 * Obtiene el usuario actual
 */
function getCurrentUser() {
    return currentUser;
}
