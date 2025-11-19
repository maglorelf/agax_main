# AGAX Web Moderna - Solución Híbrida

## 📁 Estructura de Archivos

```
/src/modern/
├── index.html      # Página principal HTML5
├── styles.css      # Estilos responsive con colores AGAX
└── script.js       # JavaScript para tabs y funcionalidad
```

## 🎨 Características Implementadas

### ✅ **Diseño Moderno con Colores Tradicionales**
- Mantiene la paleta de colores azul AGAX (#006699, #0099CC)
- Diseño responsive que se adapta a móviles, tablets y desktop
- Gradientes modernos manteniendo identidad visual

### ✅ **Sistema de Tabs para Múltiples Blogs**
4 tabs integradas con iframes:
1. **Actualidad AGAX** → agaxnet.blogspot.com
2. **Xogando co Xadrez** → xogandocoxadrez.eu
3. **Torneos** → xadrecista.eu
4. **Torneos Online** → agax.net### ✅ **Header Modernizado**
- Mantiene toda la navegación original
- Logo y banner visibles
- Enlaces a redes sociales (Instagram, Facebook, Twitter)
- Acceso a directiva, estatutos, arquivos
- Responsive collapse en móviles

### ✅ **Sidebars**
- **Izquierda**: Logos de patrocinadores (Concello, Deputación)
- **Derecha**: Accesos rápidos

### ✅ **Funcionalidades JavaScript**
- Cambio de tabs con animaciones
- Guarda última tab visitada (localStorage)
- Navegación por teclado (←→)
- Lazy loading de iframes
- Header sticky en scroll

## 🚀 Cómo Usar

### Para Desarrollo Local:
```bash
# Abrir directamente el archivo
cd src/modern
# Abrir index.html en el navegador
```

### Para Servidor:
```bash
# Copiar archivos a servidor web
scp -r src/modern/* usuario@servidor:/var/www/agax.org/
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1200px - Layout completo con 3 columnas
- **Tablet**: 992px - 1200px - Banner oculto, 3 columnas reducidas
- **Mobile Large**: 768px - 992px - 1 columna, sidebars debajo
- **Mobile Small**: < 768px - Tabs en columna, texto reducido

## 🔄 Migración Gradual (Fase Híbrida)

### Paso 1 (Actual): ✅ Completado
- Estructura HTML5 moderna
- Sistema de tabs con iframes
- Mantiene contenido de Blogger sin cambios

### Paso 2 (Futuro): 🔜
- Implementar Blogger API v3
- Extraer posts en JSON
- Renderizar posts nativamente (sin iframes)

### Paso 3 (Futuro): 🔜
- Sistema de búsqueda global
- Filtros por categorías/tags
- Comentarios integrados
- PWA (Progressive Web App)

## 🎯 Ventajas de Esta Solución

1. **Mantiene funcionalidad actual**: Los blogs siguen funcionando igual
2. **Mejora UX**: Navegación por tabs más intuitiva
3. **Responsive**: Se adapta a todos los dispositivos
4. **Moderna**: HTML5, CSS Grid/Flexbox
5. **Preparada para evolución**: Fácil migrar a API en el futuro

## 🔧 Personalización

### Cambiar URLs de Blogs:
Editar en `index.html` las URLs de los iframes:
```html
<iframe src="TU_URL_AQUI" ...></iframe>
```

### Cambiar Colores:
Editar variables CSS en `styles.css`:
```css
:root {
    --agax-blue: #006699;
    --agax-light-blue: #0099CC;
    /* ... */
}
```

## 📊 Próximos Pasos Sugeridos

1. **Testing**: Probar en diferentes navegadores y dispositivos
2. **Ajustar URLs**: Verificar que todas las URLs de blogs sean correctas
3. **Optimizar**: Comprimir imágenes del banner y logos
4. **Analytics**: Integrar Google Analytics
5. **SEO**: Añadir meta tags específicas

## 🐛 Resolución de Problemas

**Problema**: Iframe no carga contenido
- **Causa**: CORS o X-Frame-Options
- **Solución**: Algunos sitios bloquean iframes. Contactar administrador del blog.

**Problema**: Tabs no cambian
- **Causa**: JavaScript no carga
- **Solución**: Verificar consola del navegador (F12)

## 📞 Soporte

Para dudas o mejoras, contactar con el equipo de desarrollo de AGAX.

---

**Versión**: 1.0.0  
**Fecha**: Noviembre 2025  
**Licencia**: Según LICENSE del proyecto
