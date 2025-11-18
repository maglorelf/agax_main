/**
 * AGAX Blog Loader - Infinite Scroll with Blogger JSON API
 * Carga posts de agaxnet.blogspot.com con scroll infinito
 */

class BlogLoader {
    constructor(blogUrl, containerId, postsPerLoad = 5) {
        this.blogUrl = blogUrl;
        this.containerId = containerId;
        this.postsPerLoad = postsPerLoad;
        this.startIndex = 1;
        this.isLoading = false;
        this.hasMorePosts = true;
        
        this.postsGrid = document.getElementById('posts-grid');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.endMessage = document.getElementById('end-message');
        
        this.init();
    }
    
    init() {
        // Cargar posts iniciales
        this.loadPosts();
        
        // Configurar infinite scroll
        this.setupInfiniteScroll();
    }
    
    setupInfiniteScroll() {
        const container = document.getElementById(this.containerId);
        
        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            // Si está cerca del final (200px antes del final)
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                if (!this.isLoading && this.hasMorePosts) {
                    this.loadPosts();
                }
            }
        });
    }
    
    // Cargar posts usando JSONP (evita CORS)
    loadPostsJSONP() {
        return new Promise((resolve, reject) => {
            const callbackName = 'blogCallback' + Date.now();
            const feedUrl = `${this.blogUrl}/feeds/posts/default?alt=json-in-script&start-index=${this.startIndex}&max-results=${this.postsPerLoad}&callback=${callbackName}`;
            
            // Crear callback global
            window[callbackName] = (data) => {
                delete window[callbackName];
                document.body.removeChild(script);
                resolve(data);
            };
            
            // Crear script tag
            const script = document.createElement('script');
            script.src = feedUrl;
            script.onerror = () => {
                delete window[callbackName];
                document.body.removeChild(script);
                reject(new Error('Error al cargar el feed de Blogger'));
            };
            
            document.body.appendChild(script);
        });
    }
    
    async loadPosts() {
        if (this.isLoading || !this.hasMorePosts) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // Usar JSONP para evitar problemas CORS
            const data = await this.loadPostsJSONP();
            
            console.log('Posts cargados:', data);
            
            if (data.feed.entry && data.feed.entry.length > 0) {
                this.renderPosts(data.feed.entry);
                this.startIndex += data.feed.entry.length;
                
                // Si recibimos menos posts de los solicitados, no hay más
                if (data.feed.entry.length < this.postsPerLoad) {
                    this.hasMorePosts = false;
                    this.showEndMessage();
                }
            } else {
                this.hasMorePosts = false;
                this.showEndMessage();
            }
        } catch (error) {
            console.error('Error cargando posts:', error);
            console.error('Detalles del error:', {
                message: error.message,
                stack: error.stack,
                feedUrl: `${this.blogUrl}/feeds/posts/default?alt=json`
            });
            this.showError(error.message);
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }
    
    renderPosts(posts) {
        posts.forEach(post => {
            const postCard = this.createPostCard(post);
            this.postsGrid.appendChild(postCard);
        });
    }
    
    createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';
        
        // Extraer datos del post
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        const author = post.author[0].name.$t;
        const published = new Date(post.published.$t);
        const summary = this.extractSummary(post);
        const imageSmall = this.extractImage(post, 'small');  // Para card (400px)
        const imageMedium = this.extractImage(post, 'medium'); // Para modal (800px)
        const labels = post.category ? post.category.map(cat => cat.term) : [];
        const content = post.content ? post.content.$t : '';
        
        // Construir HTML
        card.innerHTML = `
            <div class="post-image-wrapper modal-trigger" style="cursor: pointer;" title="Click para ver completo">
                ${imageSmall ? 
                    `<img src="${imageSmall}" alt="${title}" class="post-image" loading="lazy">` :
                    `<div class="post-image placeholder">♟️</div>`
                }
            </div>
            <div class="post-content">
                <h3 class="post-title">
                    <a href="#" class="modal-trigger" title="Click para leer el artículo completo">${title}</a>
                </h3>
                <div class="post-meta">
                    <span class="post-date">${this.formatDate(published)}</span>
                </div>
                <div class="post-summary">${summary}</div>
                <div class="post-footer">
                    <a href="#" class="post-read-more modal-trigger">Ler máis →</a>
                    ${labels.length > 0 ? `
                        <div class="post-labels">
                            ${labels.slice(0, 3).map(label => 
                                `<span class="post-label">${label}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Agregar event listeners para abrir modal
        const triggers = card.querySelectorAll('.modal-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPostModal(title, author, published, content, link, imageMedium);
            });
        });
        
        // Animación de entrada
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
        
        return card;
    }
    
    extractSummary(post) {
        let summary = '';
        
        if (post.summary) {
            summary = post.summary.$t;
        } else if (post.content) {
            summary = post.content.$t;
        }
        
        // Limpiar HTML tags y limitar longitud
        summary = summary.replace(/<[^>]*>/g, '');
        summary = summary.replace(/&nbsp;/g, ' ');
        summary = summary.trim();
        
        if (summary.length > 250) {
            summary = summary.substring(0, 250) + '...';
        }
        
        return summary || 'Sen descrición dispoñible.';
    }
    
    extractImage(post, size = 'medium') {
        let imageUrl = null;
        
        // 1. PRIMERO: Buscar en el contenido HTML (mejor calidad)
        if (post.content) {
            const content = post.content.$t;
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
                imageUrl = imgMatch[1];
            }
        }
        
        // 2. FALLBACK: Si no hay en contenido, usar media$thumbnail
        if (!imageUrl && post.media$thumbnail) {
            imageUrl = post.media$thumbnail.url;
        }
        
        // 3. Optimizar tamaño para imágenes de Blogger/Google
        if (imageUrl && (imageUrl.includes('blogspot.com') || imageUrl.includes('googleusercontent.com'))) {
            const sizes = {
                'small': 's400',
                'medium': 's800',
                'large': 's1600'
            };
            
            const targetSize = sizes[size] || sizes.medium;
            
            // Limpiar TODOS los parámetros de tamaño existentes
            // Formatos: /s400/, /s400-c/, /w400-h300/, etc.
            imageUrl = imageUrl.replace(/\/[swh]\d+(-[ch]\d+)*\//g, '/');
            
            // Agregar el nuevo parámetro de tamaño antes del nombre del archivo
            const parts = imageUrl.split('/');
            const fileName = parts.pop(); // Último elemento (nombre archivo)
            imageUrl = parts.join('/') + `/${targetSize}/${fileName}`;
        }
        
        return imageUrl;
    }
    
    formatDate(date) {
        const meses = [
            'xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño',
            'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'
        ];
        
        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const ano = date.getFullYear();
        
        return `${dia} de ${mes} de ${ano}`;
    }
    
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }
    
    showEndMessage() {
        this.endMessage.classList.remove('hidden');
    }
    
    showError(message = '') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>⚠️ Erro ao cargar as publicacións</p>
            ${message ? `<p style="font-size: 0.9rem; color: #666;">${message}</p>` : ''}
            <p style="font-size: 0.85rem; margin-top: 1rem;">
                Podes visitar directamente o 
                <a href="${this.blogUrl}" target="_blank" style="color: var(--agax-blue);">blog de AGAX</a>
            </p>
            <button onclick="location.reload()" class="btn-reload" style="
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: var(--agax-blue);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            ">Recargar páxina</button>
        `;
        this.postsGrid.appendChild(errorDiv);
    }
    
    openPostModal(title, author, date, content, link, image) {
        const modal = document.getElementById('post-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalBody = document.getElementById('modal-body');
        
        // Procesar contenido: optimizar tamaño de imágenes
        let processedContent = content;
        
        // Reemplazar todas las imágenes en el contenido con versiones optimizadas
        processedContent = processedContent.replace(/<img([^>]+)src="([^"]+)"([^>]*)>/gi, (match, before, src, after) => {
            let optimizedSrc = src;
            
            // Optimizar solo imágenes de Blogger/Google
            if (src.includes('blogspot.com') || src.includes('googleusercontent.com')) {
                // Limpiar TODOS los parámetros de tamaño: /s400/, /w400-h300/, /s400-c/, etc.
                optimizedSrc = src.replace(/\/[swh]\d+(-[ch]\d+)*\//g, '/');
                
                // Agregar parámetro s800 antes del nombre del archivo
                const parts = optimizedSrc.split('/');
                const fileName = parts.pop();
                if (fileName) {
                    optimizedSrc = parts.join('/') + `/s800/${fileName}`;
                }
            }
            
            return `<img${before}src="${optimizedSrc}"${after} style="max-width: 100%; height: auto; display: block; margin: 1rem auto;">`;
        });
        
        // Agregar imagen destacada al inicio si existe y no está en el contenido
        let fullContent = '';
        if (image && !processedContent.includes(image)) {
            fullContent = `<img src="${image}" alt="${title}" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 0 auto 2rem; border-radius: 8px;">`;
        }
        fullContent += processedContent;
        
        // Llenar modal
        modalTitle.textContent = title;
        modalDate.textContent = `📅 ${this.formatDate(date)}`;
        modalBody.innerHTML = fullContent;
        
        // Mostrar modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Función para cargar con iframe como fallback
function loadBlogWithFallback() {
    const blogUrl = 'https://agaxnet.blogspot.com';
    const container = document.getElementById('blog-posts');
    
    // Intentar cargar con JSON
    window.agaxBlogLoader = new BlogLoader(blogUrl, 'blog-posts', 5);
    
    // Timeout: Si no carga en 5 segundos, usar iframe
    setTimeout(() => {
        const postsGrid = document.getElementById('posts-grid');
        if (postsGrid && postsGrid.children.length === 0) {
            console.warn('Carga JSON fallida, usando iframe como fallback');
            showIframeFallback(blogUrl, container);
        }
    }, 5000);
}

// Mostrar iframe como fallback
function showIframeFallback(blogUrl, container) {
    container.innerHTML = `
        <div class="blog-header">
            <h2>Actualidade AGAX</h2>
            <p style="color: #666; font-size: 0.9rem;">
                Modo de visualización alternativo
            </p>
        </div>
        <div class="iframe-container" style="min-height: 800px;">
            <iframe src="${blogUrl}/" 
                    title="Blog Actualidad AGAX"
                    frameborder="0"
                    style="width: 100%; height: 800px; border: none;">
            </iframe>
        </div>
    `;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar si estamos en la tab de actualidad
    const actualidadTab = document.getElementById('actualidad');
    if (actualidadTab) {
        console.log('AGAX Blog Loader inicializado');
        loadBlogWithFallback();
    }
    
    // Configurar modal
    setupModal();
});

// Configurar eventos del modal
function setupModal() {
    const modal = document.getElementById('post-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    if (!modal) return;
    
    // Cerrar con botón X
    modalClose?.addEventListener('click', () => {
        closeModal();
    });
    
    // Cerrar con overlay
    modalOverlay?.addEventListener('click', () => {
        closeModal();
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('post-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}
