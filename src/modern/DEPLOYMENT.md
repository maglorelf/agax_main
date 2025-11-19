# AGAX Modern - Guía de Despliegue

## 📋 Checklist de Despliegue

### 1. Archivos a Subir
Sube todos los archivos de `/src/modern/` al servidor:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `blog-loader-multi.js`
- ✅ `.htaccess` (importante para MIME types y HTTPS)
- ✅ `test.html` (para verificar funcionamiento)
- ✅ Carpeta `../galerias/` (imágenes)
- ✅ Carpeta `../imax/` (logos y recursos)

### 2. Requisitos del Servidor

#### Apache
El archivo `.htaccess` requiere los siguientes módulos activados:
```bash
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enmod mime
sudo systemctl restart apache2
```

#### Nginx
Si usas Nginx, crea este archivo de configuración:
```nginx
location /modern/ {
    # MIME Types
    types {
        text/css css;
        text/javascript js;
        application/javascript js;
    }
    
    # CORS Headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
    
    # Force HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }
    
    # Compression
    gzip on;
    gzip_types text/css text/javascript application/javascript;
}
```

### 3. Verificación Post-Despliegue

1. **Abre el test de recursos:**
   ```
   https://tu-dominio.com/modern/test.html
   ```

2. **Verifica que todos los tests pasen:**
   - ✅ CSS cargado correctamente
   - ✅ JavaScript funciona
   - ✅ Blogger API funciona (JSONP)
   - ✅ HTTPS activo

3. **Prueba en múltiples navegadores:**
   - Chrome/Brave
   - Firefox
   - Edge
   - Safari

### 4. Problemas Comunes y Soluciones

#### Problema: Estilos no cargan en Brave/Chrome
**Causa:** MIME type incorrecto para CSS
**Solución:**
- Verifica que `.htaccess` esté en el servidor
- Asegúrate que Apache tiene `mod_mime` activado
- Verifica en DevTools (F12) → Network → styles.css → Headers → Content-Type debe ser `text/css`

#### Problema: Blogs "Xogando" y "Xadrecistas" no cargan
**Causa:** Mixed Content (HTTP en página HTTPS)
**Solución:**
- Ya están cambiados a HTTPS en el código
- Verifica en consola (F12) si hay errores de "Mixed Content"
- El meta tag `upgrade-insecure-requests` debería solucionarlo automáticamente

#### Problema: CORS errors en Blogger API
**Causa:** Blogger API bloqueada por CORS
**Solución:**
- Usamos JSONP (ya implementado) que evita CORS
- Verifica que los scripts se carguen sin errores 403/404

#### Problema: Imágenes no cargan
**Causa:** Rutas relativas incorrectas
**Solución:**
- Verifica que las carpetas `../galerias/` y `../imax/` estén en el servidor
- Verifica rutas en DevTools → Network → Img

### 5. Cache del Navegador

Si haces cambios y no se ven:
1. **Hard Reload:** `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
2. **Limpiar cache:** Settings → Privacy → Clear browsing data
3. **Modo incógnito:** Abre en ventana privada para ver sin cache

### 6. Optimizaciones de Rendimiento

El archivo `.htaccess` incluye:
- ✅ Compresión Gzip para CSS/JS
- ✅ Cache headers (1 año para imágenes, 1 mes para CSS/JS)
- ✅ UTF-8 por defecto

### 7. Monitoreo

**Google PageSpeed Insights:**
```
https://pagespeed.web.dev/
```

**GTmetrix:**
```
https://gtmetrix.com/
```

### 8. SSL/HTTPS

Si el sitio no tiene HTTPS:
1. Usa **Let's Encrypt** (gratis):
   ```bash
   sudo certbot --apache -d tudominio.com -d www.tudominio.com
   ```

2. O usa **Cloudflare** (gratis) como proxy HTTPS

### 9. Backup

Antes de desplegar, haz backup de:
- `/src/index.htm` (versión antigua)
- Base de datos (si existe)
- Configuración del servidor

### 10. Rollback Plan

Si algo falla:
```bash
# Restaurar versión antigua
mv index_backup.htm index.htm
# O simplemente elimina /modern/ y usa la versión antigua
```

---

## ⚠️ IMPORTANTE: Redirect Loop Fix

Si obtienes **ERR_TOO_MANY_REDIRECTS**:

1. **ELIMINA** el archivo `.htaccess` del servidor
2. **RENOMBRA** `.htaccess.simple` a `.htaccess`
3. O **NO SUBAS** ningún `.htaccess` inicialmente

El redirect loop ocurre cuando:
- El servidor ya tiene HTTPS configurado (ej: Cloudflare, proxy)
- El `.htaccess` intenta forzar HTTPS de nuevo
- Resultado: loop infinito

**Solución:** Usa `.htaccess.simple` que NO tiene redirecciones HTTPS.

---

## 🚀 Comandos Rápidos de Despliegue

### Via FTP/SFTP (FileZilla, WinSCP)
1. Conecta al servidor
2. Navega a `/public_html/` o `/www/`
3. Sube carpeta `modern/` completa
4. **IMPORTANTE:** Sube `.htaccess.simple` y renómbralo a `.htaccess` en el servidor

### Via SSH/SCP
```bash
# Comprimir archivos localmente
cd d:/Work/code/agax_main/src/
tar -czf modern.tar.gz modern/

# Subir al servidor
scp modern.tar.gz user@servidor.com:/var/www/html/

# Descomprimir en servidor
ssh user@servidor.com
cd /var/www/html/
tar -xzf modern.tar.gz
rm modern.tar.gz

# Permisos
chmod -R 755 modern/
```

### Via Git (recomendado)
```bash
# En servidor
cd /var/www/html/
git clone https://github.com/maglorelf/agax_main.git
ln -s agax_main/src/modern modern
```

---

## 📞 Soporte

Si encuentras problemas:
1. Abre `test.html` y copia los resultados
2. Abre DevTools (F12) → Console y copia errores
3. Abre DevTools (F12) → Network y verifica qué recursos fallan

---

## ✅ Checklist Final

- [ ] Todos los archivos subidos
- [ ] `.htaccess` presente y funcional
- [ ] test.html muestra todos los tests en verde
- [ ] Probado en Chrome, Firefox, Edge
- [ ] Probado en móvil
- [ ] HTTPS activado
- [ ] Sin errores en consola
- [ ] Imágenes cargan correctamente
- [ ] Blogs cargan posts
- [ ] Búsqueda funciona
- [ ] Chips de filtro funcionan
- [ ] Modal abre correctamente
- [ ] Infinite scroll funciona

---

¡Éxito! 🎉
