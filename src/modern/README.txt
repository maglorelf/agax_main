AGAX MODERN - INSTRUCCIONES DE DESPLIEGUE
==========================================

ARCHIVOS A SUBIR:
-----------------
✓ index.html
✓ styles.css
✓ script.js
✓ blog-loader-multi.js
✓ test.html (para verificar)

NO SUBIR:
---------
✗ .htaccess (eliminado - Cloudflare maneja HTTPS)
✗ .htaccess.simple (no necesario)

PASOS:
------
1. Sube todos los archivos .html, .css, .js al servidor
2. NO subas ningún archivo .htaccess
3. Asegúrate que Cloudflare esté configurado en modo "Full" o "Full (strict)"
4. Limpia caché del navegador (Ctrl+Shift+Del)
5. Abre: https://agax.org/modern/test.html
6. Verifica que todos los tests pasen

CONFIGURACIÓN CLOUDFLARE:
-------------------------
- SSL/TLS mode: Full (recommended) o Full (strict)
- Always Use HTTPS: ON (Cloudflare lo maneja)
- Auto Minify: ON (CSS, JS, HTML)
- Brotli: ON

Si hay problemas:
-----------------
1. Abre DevTools (F12) → Console
2. Busca errores en rojo
3. Verifica que no haya archivos .htaccess en el servidor
4. Limpia caché de Cloudflare también

¡Listo! 🎉
