/**
 * Cliente API - Galería de Arte
 * Comunicación con el backend Express
 */

const API_URL = CONFIG.API_URL;

/**
 * Obtiene el token JWT del localStorage
 */
function getToken() {
    return localStorage.getItem('token');
}

/**
 * Realiza una petición a la API
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
    }

    return data;
}

/**
 * Auth API
 */
const authAPI = {
    registro: (datos) => apiRequest('/auth/registro', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    login: (username, contraseña) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, contraseña })
    }),
    verificar: () => apiRequest('/auth/verificar')
};

/**
 * Usuarios API
 */
const usuariosAPI = {
    obtenerPerfil: (id) => apiRequest(`/usuarios/${id}`),
    editarPerfil: (datos) => apiRequest('/usuarios/perfil', {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminarCuenta: () => apiRequest('/usuarios/cuenta', {
        method: 'DELETE'
    })
};

/**
 * Colecciones API
 */
const coleccionesAPI = {
    listar: () => apiRequest('/colecciones'),
    obtener: (id) => apiRequest(`/colecciones/${id}`),
    crear: (datos) => apiRequest('/colecciones', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    actualizar: (id, datos) => apiRequest(`/colecciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminar: (id) => apiRequest(`/colecciones/${id}`, {
        method: 'DELETE'
    })
};

/**
 * Obras API
 */
const obrasAPI = {
    listar: (limite = 20, offset = 0) => apiRequest(`/obras?limite=${limite}&offset=${offset}`),
    buscar: (q) => apiRequest(`/obras/buscar?q=${encodeURIComponent(q)}`),
    obtener: (id) => apiRequest(`/obras/${id}`),
    crear: (datos) => apiRequest('/obras', {
        method: 'POST',
        body: JSON.stringify(datos)
    }),
    actualizar: (id, datos) => apiRequest(`/obras/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos)
    }),
    eliminar: (id) => apiRequest(`/obras/${id}`, {
        method: 'DELETE'
    })
};

/**
 * Likes API
 */
const likesAPI = {
    darLike: (id_obra) => apiRequest(`/likes/${id_obra}`, {
        method: 'POST'
    }),
    quitarLike: (id_obra) => apiRequest(`/likes/${id_obra}`, {
        method: 'DELETE'
    }),
    estado: (id_obra) => apiRequest(`/likes/${id_obra}`)
};
