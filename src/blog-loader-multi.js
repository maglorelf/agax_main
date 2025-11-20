/**
 * AGAX Multi-Blog Loader - Unified feed with search & filters
 * Carga posts de múltiples blogs de AGAX con búsqueda y filtros
 */

class MultiBlogLoader {
    constructor() {
        // Configuración de blogs
        this.blogs = [
            {
                id: 'novas',
                name: 'Novas',
                url: 'https://agaxnet.blogspot.com',
                color: '#006699'
            },
            {
                id: 'agaxnet',
                name: 'agax.net',
                url: 'https://agax.net',
                color: '#0099CC'
            },
            {
                id: 'xogando',
                name: 'Xogando co Xadrez',
                url: 'https://www.xogandocoxadrez.eu',
                color: '#00AA66'
            },
            {
                id: 'xadrecista',
                name: 'Xadrecistas',
                url: 'https://www.xadrecista.eu',
                color: '#CC6600'
            }
        ];
        
        // Estado
        this.allPosts = [];
        this.filteredPosts = [];
        this.displayedPosts = [];
        this.postsPerLoad = 10;
        this.currentIndex = 0;
        this.isLoading = false;
        
        // Filtros
        this.filters = {
            searchText: '',
            dateFrom: null,
            dateTo: null,
            blogSource: 'all'
        };
        
        // DOM Elements
        this.postsGrid = document.getElementById('posts-grid');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.endMessage = document.getElementById('end-message');
        this.searchInput = document.getElementById('search-title');
        this.dateFromInput = document.getElementById('search-date-from');
        this.dateToInput = document.getElementById('search-date-to');
        this.blogChips = document.querySelectorAll('.blog-chip');
        this.clearButton = document.getElementById('clear-filters');
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Inicializando Multi-Blog Loader...');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Cargar posts de todos los blogs
        await this.loadAllBlogs();
        
        // Mostrar posts iniciales
        this.applyFilters();
        this.displayMorePosts();
        
        // Setup infinite scroll
        this.setupInfiniteScroll();
    }
    
    setupEventListeners() {
        // Search input with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.searchText = e.target.value.toLowerCase();
                this.applyFiltersAndReload();
            }, 300);
        });
        
        // Date filters
        this.dateFromInput.addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value ? new Date(e.target.value) : null;
            this.applyFiltersAndReload();
        });
        
        this.dateToInput.addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value ? new Date(e.target.value + 'T23:59:59') : null;
            this.applyFiltersAndReload();
        });
        
        // Blog chips filter
        this.blogChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const blogId = chip.dataset.blog;
                
                // Toggle chip selection
                if (this.filters.blogSource === blogId) {
                    // Si ya está activo, mostrar todos
                    this.filters.blogSource = 'all';
                    this.blogChips.forEach(c => c.classList.remove('active'));
                } else {
                    // Activar solo este chip
                    this.filters.blogSource = blogId;
                    this.blogChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                }
                
                this.applyFiltersAndReload();
            });
        });
        
        // Clear filters
        this.clearButton.addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    clearFilters() {
        this.filters = {
            searchText: '',
            dateFrom: null,
            dateTo: null,
            blogSource: 'all'
        };
        
        this.searchInput.value = '';
        this.dateFromInput.value = '';
        this.dateToInput.value = '';
        this.blogChips.forEach(c => c.classList.remove('active'));
        
        this.applyFiltersAndReload();
    }
    
    async loadAllBlogs() {
        this.showLoading();
        
        try {
            const promises = this.blogs.map(blog => this.loadBlogPosts(blog));
            const results = await Promise.all(promises);
            
            // Combinar todos los posts
            this.allPosts = results.flat();
            
            // Ordenar por fecha (más recientes primero)
            this.allPosts.sort((a, b) => b.date - a.date);
            
            console.log(`✅ Cargados ${this.allPosts.length} posts de ${this.blogs.length} blogs`);
        } catch (error) {
            console.error('❌ Error cargando blogs:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }
    
    async loadBlogPosts(blog, maxResults = 25) {
        return new Promise((resolve, reject) => {
            const callbackName = 'blogCallback' + Date.now() + Math.random().toString(36).substr(2, 9);
            const feedUrl = `${blog.url}/feeds/posts/default?alt=json-in-script&max-results=${maxResults}&callback=${callbackName}`;
            
            // Timeout de 10 segundos
            const timeout = setTimeout(() => {
                cleanup();
                console.warn(`⚠️ Timeout loading ${blog.name}`);
                resolve([]); // Resolver con array vacío en lugar de rechazar
            }, 10000);
            
            const cleanup = () => {
                clearTimeout(timeout);
                if (window[callbackName]) {
                    delete window[callbackName];
                }
                if (script.parentNode) {
                    document.body.removeChild(script);
                }
            };
            
            window[callbackName] = (data) => {
                cleanup();
                
                try {
                    const posts = this.parseBlogPosts(data, blog);
                    console.log(`✓ ${blog.name}: ${posts.length} posts`);
                    resolve(posts);
                } catch (error) {
                    console.error(`Error parsing ${blog.name}:`, error);
                    resolve([]);
                }
            };
            
            const script = document.createElement('script');
            script.src = feedUrl;
            script.onerror = () => {
                cleanup();
                console.error(`Error loading ${blog.name}`);
                resolve([]);
            };
            
            document.body.appendChild(script);
        });
    }
    
    parseBlogPosts(data, blog) {
        if (!data.feed || !data.feed.entry) {
            return [];
        }
        
        return data.feed.entry.map(post => {
            const title = post.title.$t;
            const link = post.link.find(l => l.rel === 'alternate').href;
            const date = new Date(post.published.$t);
            const content = post.content ? post.content.$t : '';
            const summary = this.extractSummary(post);
            const imageSmall = this.extractImage(post, 'small');
            const imageMedium = this.extractImage(post, 'medium');
            const labels = post.category ? post.category.map(cat => cat.term) : [];
            
            return {
                title,
                link,
                date,
                content,
                summary,
                imageSmall,
                imageMedium,
                labels,
                blog: blog
            };
        });
    }
    
    applyFilters() {
        this.filteredPosts = this.allPosts.filter(post => {
            // Filter by search text
            if (this.filters.searchText) {
                const searchLower = this.filters.searchText;
                if (!post.title.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            
            // Filter by date range
            if (this.filters.dateFrom && post.date < this.filters.dateFrom) {
                return false;
            }
            
            if (this.filters.dateTo && post.date > this.filters.dateTo) {
                return false;
            }
            
            // Filter by blog source
            if (this.filters.blogSource !== 'all' && post.blog.id !== this.filters.blogSource) {
                return false;
            }
            
            return true;
        });
        
        console.log(`Filtrados: ${this.filteredPosts.length} de ${this.allPosts.length} posts`);
    }
    
    applyFiltersAndReload() {
        this.applyFilters();
        this.currentIndex = 0;
        this.displayedPosts = [];
        this.postsGrid.innerHTML = '';
        this.displayMorePosts();
    }
    
    displayMorePosts() {
        const endIndex = Math.min(this.currentIndex + this.postsPerLoad, this.filteredPosts.length);
        const postsToShow = this.filteredPosts.slice(this.currentIndex, endIndex);
        
        if (postsToShow.length === 0) {
            if (this.currentIndex === 0) {
                this.showNoResults();
            } else {
                this.showEndMessage();
            }
            return;
        }
        
        postsToShow.forEach(post => {
            const card = this.createPostCard(post);
            this.postsGrid.appendChild(card);
            this.displayedPosts.push(post);
        });
        
        this.currentIndex = endIndex;
        
        // Hide end message if there are more posts
        if (this.currentIndex < this.filteredPosts.length) {
            this.hideEndMessage();
        } else {
            this.showEndMessage();
        }
    }
    
    createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card';
        
        card.innerHTML = `
            <div class="post-image-wrapper modal-trigger" style="cursor: pointer;" title="Click para ver completo">
                <span class="blog-source ${post.blog.id}" style="background-color: ${post.blog.color};">
                    ${post.blog.name}
                </span>
                ${post.imageSmall ? 
                    `<img src="${post.imageSmall}" alt="${post.title}" class="post-image" loading="lazy" onerror="this.parentElement.innerHTML='<span class=\\"blog-source ${post.blog.id}\\" style=\\"background-color: ${post.blog.color};\\">${post.blog.name}</span><div class=\\"post-image placeholder\\">♟️</div>';">` :
                    `<div class="post-image placeholder">♟️</div>`
                }
            </div>
            <div class="post-content">
                <h3 class="post-title">
                    <a href="#" class="modal-trigger" title="Click para leer el artículo completo">${post.title}</a>
                </h3>
                <div class="post-meta">
                    <span class="post-date">${this.formatDate(post.date)}</span>
                </div>
                <div class="post-summary">${post.summary}</div>
                <div class="post-footer">
                    <a href="#" class="post-read-more modal-trigger">Ler máis →</a>
                    ${post.labels.length > 0 ? `
                        <div class="post-labels">
                            ${post.labels.slice(0, 3).map(label => 
                                `<span class="post-label">${label}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Event listeners para modal
        const triggers = card.querySelectorAll('.modal-trigger');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPostModal(post);
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
        
        // Limpiar HTML tags
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
        
        // 1. Buscar en contenido HTML primero (mejor calidad)
        if (post.content) {
            const content = post.content.$t;
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
                imageUrl = imgMatch[1];
            }
        }
        
        // 2. Fallback a thumbnail
        if (!imageUrl && post.media$thumbnail) {
            imageUrl = post.media$thumbnail.url;
        }
        
        // 3. Si no hay imagen, retornar null
        if (!imageUrl) {
            return null;
        }
        
        // 4. Para cards pequeñas (small), intentar optimizar
        // Para medium/large, usar URL original para evitar problemas
        if (size === 'small' && (imageUrl.includes('blogspot.com') || imageUrl.includes('googleusercontent.com'))) {
            try {
                // Solo cambiar el tamaño si ya tiene parámetro de tamaño
                if (/\/s\d+\//.test(imageUrl)) {
                    imageUrl = imageUrl.replace(/\/s\d+\//g, '/s400/');
                } else if (/\/w\d+-h\d+\//.test(imageUrl)) {
                    imageUrl = imageUrl.replace(/\/w\d+-h\d+\//g, '/s400/');
                }
                // Si no tiene parámetros, dejar la URL original
            } catch (error) {
                console.warn('Error optimizando imagen:', error);
            }
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
    
    setupInfiniteScroll() {
        const container = document.getElementById('blog-posts');
        
        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;
            
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                if (!this.isLoading && this.currentIndex < this.filteredPosts.length) {
                    this.displayMorePosts();
                }
            }
        });
    }
    
    openPostModal(post) {
        const modal = document.getElementById('post-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalBody = document.getElementById('modal-body');
        
        // Procesar contenido: mantener imágenes originales
        let processedContent = post.content;
        
        // Solo agregar estilos responsive, sin modificar URLs
        processedContent = processedContent.replace(/<img([^>]*)>/gi, (match, attrs) => {
            return `<img${attrs} style="max-width: 100%; height: auto; display: block; margin: 1rem auto;" onerror="this.style.display='none';">`;
        });
        
        // Agregar imagen destacada si existe
        let fullContent = '';
        if (post.imageMedium && !processedContent.includes(post.imageMedium)) {
            fullContent = `
                <div style="background-color: ${post.blog.color}; color: white; padding: 0.5rem 1rem; border-radius: 5px; display: inline-block; margin-bottom: 1rem; font-weight: bold;">
                    📰 ${post.blog.name}
                </div>
                <img src="${post.imageMedium}" alt="${post.title}" style="width: 100%; max-width: 100%; height: auto; display: block; margin: 0 auto 2rem; border-radius: 8px;">
            `;
        } else {
            fullContent = `
                <div style="background-color: ${post.blog.color}; color: white; padding: 0.5rem 1rem; border-radius: 5px; display: inline-block; margin-bottom: 1rem; font-weight: bold;">
                    📰 ${post.blog.name}
                </div>
            `;
        }
        fullContent += processedContent;
        
        modalTitle.textContent = post.title;
        modalDate.textContent = `📅 ${this.formatDate(post.date)}`;
        modalBody.innerHTML = fullContent;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    showLoading() {
        this.isLoading = true;
        this.loadingIndicator.classList.remove('hidden');
    }
    
    hideLoading() {
        this.isLoading = false;
        this.loadingIndicator.classList.add('hidden');
    }
    
    showEndMessage() {
        this.endMessage.classList.remove('hidden');
    }
    
    hideEndMessage() {
        this.endMessage.classList.add('hidden');
    }
    
    showNoResults() {
        this.postsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--agax-dark-gray);">
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">🔍 Non se atoparon resultados</h3>
                <p>Proba con outros filtros ou termos de busca</p>
            </div>
        `;
    }
    
    showError() {
        this.postsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3 style="color: var(--agax-blue); margin-bottom: 1rem;">⚠️ Erro ao cargar os blogs</h3>
                <p>Por favor, intenta recargar a páxina</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--agax-blue);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">Recargar</button>
            </div>
        `;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 AGAX Multi-Blog Loader inicializando...');
    window.multiBlogLoader = new MultiBlogLoader();
    
    // Configurar modal
    setupModal();
});

// Configurar eventos del modal
function setupModal() {
    const modal = document.getElementById('post-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    
    if (!modal) return;
    
    modalClose?.addEventListener('click', () => {
        closeModal();
    });
    
    modalOverlay?.addEventListener('click', () => {
        closeModal();
    });
    
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
