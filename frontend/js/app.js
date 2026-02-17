/**
 * Aplicación principal - Galería de Arte
 * Navegación, carga de páginas y lógica de la UI
 */

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await checkAuth();
    setupNavigation();
    setupModals();
    setupForms();
    loadInicio();
}

/**
 * Navegación entre páginas
 */
function setupNavigation() {
    // Links del navbar
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    // Botones login/registro
    document.getElementById('btnLogin').addEventListener('click', () => showModal('modalLogin'));
    document.getElementById('btnRegistro').addEventListener('click', () => showModal('modalRegistro'));
    document.getElementById('btnLogout').addEventListener('click', () => {
        logout();
        navigateTo('inicio');
    });

    // Menú móvil
    document.getElementById('navToggle').addEventListener('click', () => {
        document.getElementById('navMenu').classList.toggle('active');
    });
}

function navigateTo(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${pageName}`);
    if (pageEl) pageEl.classList.add('active');

    // Cerrar menú móvil
    document.getElementById('navMenu').classList.remove('active');

    // Cargar contenido según página
    switch (pageName) {
        case 'inicio': loadInicio(); break;
        case 'explorar': loadExplorar(); break;
        case 'perfil': loadPerfil(); break;
        case 'crear-obra': loadCrearObra(); break;
    }
}

/**
 * Modales
 */
function setupModals() {
    const overlay = document.getElementById('modalOverlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideModals();
    });

    document.getElementById('modalObraClose').addEventListener('click', hideModals);
    document.getElementById('btnCancelarObra').addEventListener('click', () => navigateTo('inicio'));
}

function showModal(modalId) {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
    document.getElementById('modalOverlay').classList.add('active');
}

function hideModals() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

/**
 * Toast - mensajes
 */
function showToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

/**
 * Formularios
 */
function setupForms() {
    // Login
    document.getElementById('formLogin').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        try {
            await login(form.username.value.trim(), form.contraseña.value);
            hideModals();
            showToast('Sesión iniciada', 'success');
            loadInicio();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // Registro
    document.getElementById('formRegistro').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const datos = {
            nombre: form.nombre.value.trim(),
            username: form.username.value.trim(),
            correo: form.correo.value.trim(),
            contraseña: form.contraseña.value,
            descripcion: form.descripcion.value.trim() || undefined
        };
        try {
            await registro(datos);
            hideModals();
            showToast('Cuenta creada correctamente', 'success');
            loadInicio();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // Crear obra
    document.getElementById('formCrearObra').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const datos = {
            titulo: form.obraTitulo.value.trim(),
            descripcion: form.obraDescripcion.value.trim() || undefined,
            imagen_url: form.obraImagen.value.trim(),
            id_coleccion: form.obraColeccion.value ? parseInt(form.obraColeccion.value) : undefined
        };
        try {
            await obrasAPI.crear(datos);
            showToast('Obra publicada correctamente', 'success');
            form.reset();
            navigateTo('perfil');
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // Buscar obras
    document.getElementById('btnBuscar').addEventListener('click', () => {
        const q = document.getElementById('searchObras').value.trim();
        loadExplorar(q);
    });
    document.getElementById('searchObras').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('btnBuscar').click();
        }
    });
}

/**
 * Cargar página Inicio
 */
async function loadInicio() {
    try {
        const data = await obrasAPI.listar(12, 0);
        renderGallery(document.getElementById('galleryInicio'), data.obras);
    } catch (err) {
        document.getElementById('galleryInicio').innerHTML = 
            '<p class="text-muted">No hay obras para mostrar.</p>';
    }
}

/**
 * Cargar página Explorar
 */
async function loadExplorar(q = '') {
    const gallery = document.getElementById('galleryExplorar');
    try {
        let obras;
        if (q) {
            const data = await obrasAPI.buscar(q);
            obras = data.obras;
        } else {
            const data = await obrasAPI.listar(50, 0);
            obras = data.obras;
        }
        renderGallery(gallery, obras);
    } catch (err) {
        gallery.innerHTML = '<p class="text-muted">Error al cargar obras.</p>';
    }
}

/**
 * Cargar página Perfil
 */
async function loadPerfil() {
    const container = document.getElementById('profileContainer');
    const user = getCurrentUser();

    if (!user) {
        container.innerHTML = '<p>Inicia sesión para ver tu perfil.</p>';
        return;
    }

    try {
        const data = await usuariosAPI.obtenerPerfil(user.id_usuario);
        const { usuario, obras, colecciones } = data;

        container.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">${usuario.nombre.charAt(0)}</div>
                <div class="profile-info">
                    <h2>${escapeHtml(usuario.nombre)}</h2>
                    <p class="username">@${escapeHtml(usuario.username)}</p>
                    ${usuario.descripcion ? `<p class="desc">${escapeHtml(usuario.descripcion)}</p>` : ''}
                    <div class="profile-actions">
                        <button class="btn btn-outline btn-sm" onclick="showToast('Editar perfil próximamente', 'info')">Editar perfil</button>
                    </div>
                </div>
            </div>
            <h3 style="margin-bottom:1rem; font-family:var(--font-display)">Mis obras</h3>
            <div class="gallery-grid" id="profileGallery"></div>
        `;

        renderGallery(document.getElementById('profileGallery'), obras);
    } catch (err) {
        container.innerHTML = `<p>Error: ${err.message}</p>`;
    }
}

/**
 * Cargar página Crear obra
 */
async function loadCrearObra() {
    const user = getCurrentUser();
    const select = document.getElementById('obraColeccion');

    if (!user) {
        showToast('Inicia sesión para crear obras', 'error');
        navigateTo('inicio');
        return;
    }

    // Cargar colecciones
    select.innerHTML = '<option value="">Sin colección</option>';
    try {
        const data = await coleccionesAPI.listar();
        data.colecciones.forEach(c => {
            select.innerHTML += `<option value="${c.id_coleccion}">${escapeHtml(c.nombre)}</option>`;
        });
    } catch (e) {
        // Sin colecciones
    }
}

/**
 * Renderizar galería de obras
 */
function renderGallery(container, obras) {
    if (!obras || obras.length === 0) {
        container.innerHTML = '<p style="color:var(--color-text-muted); grid-column:1/-1;">No hay obras para mostrar.</p>';
        return;
    }

    container.innerHTML = obras.map(obra => `
        <div class="obra-card" data-id="${obra.id_obra}">
            <img class="obra-card-image" src="${escapeHtml(obra.imagen_url)}" alt="${escapeHtml(obra.titulo)}" 
                 onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">
            <div class="obra-card-body">
                <h3 class="obra-card-title">${escapeHtml(obra.titulo)}</h3>
                <p class="obra-card-author">@${escapeHtml(obra.autor_username)}</p>
                <span class="obra-card-likes ${obra.dioLike ? 'liked' : ''}">♥ ${obra.likes_count || 0}</span>
            </div>
        </div>
    `).join('');

    // Click en obra -> abrir modal
    container.querySelectorAll('.obra-card').forEach(card => {
        card.addEventListener('click', () => openObraModal(card.dataset.id));
    });
}

/**
 * Abrir modal de obra individual
 */
async function openObraModal(id) {
    try {
        const data = await obrasAPI.obtener(id);
        const obra = data.obra;

        document.getElementById('obraDetail').innerHTML = `
            <img src="${escapeHtml(obra.imagen_url)}" alt="${escapeHtml(obra.titulo)}" 
                 onerror="this.src='https://via.placeholder.com/500?text=Imagen+no+disponible'">
            <h3>${escapeHtml(obra.titulo)}</h3>
            <p class="autor">por @${escapeHtml(obra.autor_username)}</p>
            ${obra.descripcion ? `<p class="desc">${escapeHtml(obra.descripcion)}</p>` : ''}
            <p class="likes">♥ ${obra.likes_count || 0} likes</p>
            ${getCurrentUser() ? `
                <button class="btn ${obra.dioLike ? 'btn-outline' : 'btn-primary'}" id="btnLikeObra" data-id="${obra.id_obra}" data-liked="${obra.dioLike}">
                    ${obra.dioLike ? 'Quitar like' : 'Dar like'}
                </button>
            ` : ''}
        `;

        showModal('modalObra');

        const btnLike = document.getElementById('btnLikeObra');
        if (btnLike) {
            btnLike.addEventListener('click', async () => {
                try {
                    if (btnLike.dataset.liked === 'true') {
                        await likesAPI.quitarLike(obra.id_obra);
                        btnLike.textContent = 'Dar like';
                        btnLike.classList.remove('btn-outline');
                        btnLike.classList.add('btn-primary');
                        btnLike.dataset.liked = 'false';
                    } else {
                        await likesAPI.darLike(obra.id_obra);
                        btnLike.textContent = 'Quitar like';
                        btnLike.classList.remove('btn-primary');
                        btnLike.classList.add('btn-outline');
                        btnLike.dataset.liked = 'true';
                    }
                    const countEl = document.querySelector('.obra-detail .likes');
                    const count = parseInt(countEl.textContent.match(/\d+/)[0]);
                    countEl.textContent = `♥ ${btnLike.dataset.liked === 'true' ? count + 1 : count - 1} likes`;
                } catch (e) {
                    showToast(e.message, 'error');
                }
            });
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
