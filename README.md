# Electricidad Sana

Web de **Electricidad Sana**, electricista en Barcelona → **https://electricidadsana.es**

Web estática de una sola página: HTML, CSS y JavaScript puro, sin frameworks, sin dependencias y sin paso de compilación. Se publica con GitHub Pages desde la rama `main`.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Toda la página, los textos legales (en ventanas `<dialog>`) y los datos estructurados para Google (`application/ld+json`) |
| `styles.css` | Estilos, mobile-first. Colores y medidas en variables `:root` al principio |
| `script.js` | Menú móvil, visor de fotos, ventanas legales y animaciones al hacer scroll |
| `img/` | Logo, favicon, imagen para redes (`og-image.jpg`) y fotos de trabajos |
| `404.html` | Página de error |
| `robots.txt`, `sitemap.xml` | Indexación en buscadores |
| `CNAME` | Dominio personalizado de GitHub Pages |
| `.nojekyll` | Sirve los archivos tal cual, sin procesar con Jekyll |

## Desarrollo local

```bash
git clone https://github.com/electrisan/electricidadsana.git
cd electricidadsana
npx browser-sync start --server --files "*.html, *.css, *.js, img/*"
```

Se abre en el navegador y se recarga sola al guardar. La dirección *External* sirve para verla en el móvil dentro de la misma wifi. Alternativas: extensión **Live Server** de VS Code, o `python3 -m http.server` (recargando a mano).

## Publicar

Cada `git push` a `main` se publica automáticamente en 1–2 minutos (estado en la pestaña **Actions** del repositorio). Si no ves el cambio, recarga sin caché (Ctrl+F5).

## Cambios habituales

**Fotos de trabajos.** La galería usa `img/trabajo-N.jpg`. Para cambiar una foto, sustituye el archivo por otro con el mismo nombre. Para añadir o quitar fotos, edita los `<figure>` de la sección `TRABAJOS` en `index.html`. Ahí también están el `alt` (descripción para buscadores y lectores de pantalla) y el `<figcaption>` (el texto visible). Recomendado: unos 1200 px de ancho y menos de 300 KB por foto (por ejemplo con [squoosh.app](https://squoosh.app)). Las fotos se recortan solas en proporción 4:3.

**Reseñas.** Se copian a mano desde el perfil de Google en la sección `OPINIONES` de `index.html`. Los botones enlazan al perfil de Google Maps y al formulario de reseña de Google. Ese enlace sale de *Leer reseñas → Conseguir más reseñas* en el perfil de empresa.

**Datos de la empresa.** Están en `index.html`: cabecera, sección de contacto, pie, textos legales y el bloque `application/ld+json`. Para cambiar uno, busca y reemplaza el valor actual en todo el archivo:

| Dato | Valor actual |
|---|---|
| Teléfono en enlaces (`tel:`, `wa.me`) | `624134152` |
| Teléfono visible | `624 134 152` |
| Email | `jose@electricidadsana.es` |
| Domicilio en el pie | `Gràcia, Barcelona` |
| Domicilio en aviso legal y privacidad | `C/ Francisco Giner, 12, 08012 Barcelona` |

Si cambias el teléfono, `img/og-image.jpg` también lo lleva escrito.

**Buscadores.** Tras un cambio importante, actualiza `<lastmod>` en `sitemap.xml`. La web está pensada para darse de alta en [Google Search Console](https://search.google.com/search-console) enviando `https://electricidadsana.es/sitemap.xml`.

## Dominio

`electricidadsana.es` apunta a GitHub Pages con estos registros DNS:

| Tipo | Host | Valor |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `electrisan.github.io` |

Configuración en **Settings → Pages** (dominio personalizado y *Enforce HTTPS*).

## Licencia

© Electricidad Sana (Jose Luis Rodríguez). Todos los derechos reservados. Ver [LICENSE](LICENSE).
