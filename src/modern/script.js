/**
 * AGAX Modern Web - JavaScript
 * Manejo de tabs y funcionalidad interactiva
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initResponsiveMenu();
    saveLastTab();
});

/**
 * Inicializar sistema de tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    // Restaurar última tab visitada o mostrar la primera
    const lastTab = localStorage.getItem('agax-active-tab') || 'actualidad';
    showTab(lastTab);
    
    // Agregar event listeners a los botones
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            showTab(tabId);
            
            // Guardar preferencia
            localStorage.setItem('agax-active-tab', tabId);
        });
    });
}

/**
 * Mostrar tab específica
 */
function showTab(tabId) {
    // Ocultar todos los panels
    const allPanels = document.querySelectorAll('.tab-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Mostrar el panel seleccionado
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
        targetPanel.classList.add('active');
        
        // Cargar iframe si no está cargado (lazy loading)
        const iframe = targetPanel.querySelector('iframe');
        if (iframe && !iframe.src) {
            iframe.src = iframe.getAttribute('data-src');
        }
    }
    
    // Activar el botón correspondiente
    const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

/**
 * Guardar última tab visitada cada 30 segundos
 */
function saveLastTab() {
    setInterval(() => {
        const activeButton = document.querySelector('.tab-button.active');
        if (activeButton) {
            const tabId = activeButton.getAttribute('data-tab');
            localStorage.setItem('agax-active-tab', tabId);
        }
    }, 30000);
}

/**
 * Funcionalidad responsive para menú móvil (futuro)
 */
function initResponsiveMenu() {
    // Detectar scroll para hacer header sticky
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.style.position = 'relative';
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll down - ocultar header top
            header.querySelector('.header-top').style.transform = 'translateY(-100%)';
        } else {
            // Scroll up - mostrar header top
            header.querySelector('.header-top').style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Utilidad: Detectar si iframe está cargado
 */
function onIframeLoad(iframe) {
    iframe.addEventListener('load', function() {
        console.log(`Iframe ${iframe.title} cargado correctamente`);
        
        // Remover indicador de carga si existe
        const loadingIndicator = iframe.parentElement.querySelector('.loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    });
}

/**
 * Agregar indicadores de carga a iframes
 */
document.querySelectorAll('iframe').forEach(iframe => {
    const container = iframe.parentElement;
    
    // Crear indicador de carga
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Cargando contenido';
    container.insertBefore(loading, iframe);
    
    // Remover al cargar
    onIframeLoad(iframe);
});

/**
 * Accesibilidad: Navegación por teclado
 */
document.addEventListener('keydown', function(e) {
    // Si está en un input/textarea, no hacer nada
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const activeButton = document.querySelector('.tab-button.active');
    if (!activeButton) return;
    
    let nextButton = null;
    
    // Flecha izquierda o arriba: tab anterior
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextButton = activeButton.previousElementSibling;
    }
    
    // Flecha derecha o abajo: tab siguiente
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextButton = activeButton.nextElementSibling;
    }
    
    // Si existe botón siguiente/anterior, hacer click
    if (nextButton && nextButton.classList.contains('tab-button')) {
        e.preventDefault();
        nextButton.click();
        nextButton.focus();
    }
});

/**
 * Analytics: Registrar cambios de tab (preparado para Google Analytics)
 */
function trackTabChange(tabId) {
    // Integrar con Google Analytics cuando esté configurado
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tab_change', {
            'event_category': 'Navigation',
            'event_label': tabId,
            'value': 1
        });
    }
    
    console.log(`Tab cambiada a: ${tabId}`);
}

/**
 * Recargar iframe actual (útil para refrescar contenido)
 */
function reloadCurrentIframe() {
    const activePanel = document.querySelector('.tab-panel.active');
    if (activePanel) {
        const iframe = activePanel.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }
}

/**
 * Exponer funciones globales útiles
 */
window.agaxWeb = {
    showTab: showTab,
    reloadCurrentIframe: reloadCurrentIframe,
    version: '1.0.0'
};

// Log de inicialización
console.log('%c AGAX Web Moderna v1.0.0 ', 'background: #006699; color: white; font-weight: bold; padding: 5px;');
console.log('Sistema de tabs inicializado correctamente');
