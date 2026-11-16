# Electricidad Sana

Web de **Electricidad Sana**, electricista en Barcelona → **https://electricidadsana.es**

Web estática en tres idiomas: HTML, CSS y JavaScript puro, sin frameworks, sin dependencias, sin paso de compilación y sin cookies. Se publica con GitHub Pages desde la rama `main`.

| Idioma | URL | Archivo |
|---|---|---|
| Castellano (por defecto) | `/` | `index.html` |
| Català | `/ca/` | `ca/index.html` |
| English | `/en/` | `en/index.html` |

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html`, `ca/index.html`, `en/index.html` | Una página por idioma, con sus textos legales (ventanas `<dialog>`) y datos estructurados para Google (`application/ld+json`) |
| `styles.css` | Estilos comunes, mobile-first. Colores y medidas en variables `:root` |
| `script.js` | JS común: menú móvil, visor de fotos, ventanas legales, animaciones y pop-up de idioma |
| `img/` | Logo, favicon, imagen para redes (`og-image.jpg`) y fotos de trabajos |
| `404.html` | Página de error (en los tres idiomas) |
| `robots.txt`, `sitemap.xml` | Indexación; el sitemap enlaza las tres versiones con `hreflang` |
| `CNAME`, `.nojekyll` | Configuración de GitHub Pages |

Las páginas de `ca/` y `en/` usan rutas relativas con `../` para los archivos comunes (`../styles.css`, `../img/…`).

## Desarrollo local

```bash
git clone https://github.com/electrisan/electricidadsana.git
cd electricidadsana
python3 -m http.server 8000      # y abrir http://localhost:8000
```

Con recarga automática al guardar: extensión **Live Server** de VS Code (*Open with Live Server*). Conviene usar un servidor y no abrir el archivo con doble clic, para que los enlaces entre idiomas (`ca/`, `en/`) funcionen igual que en la web real.

## Publicar

Cada `git push` a `main` se publica automáticamente en 1–2 minutos (estado en la pestaña **Actions**). Si no ves el cambio, recarga sin caché (Ctrl+F5).

## Idiomas

**Cada cambio de contenido se hace en las tres páginas.** La estructura HTML es la misma en las tres; solo cambian los textos, las rutas (`../` en `ca/` y `en/`) y estos elementos de la cabecera de cada página:

- `<html lang="…">`, `<title>`, `<meta name="description">` y las etiquetas `og:`.
- `<link rel="canonical">`, apuntando a la URL de esa página.
- Los `<link rel="alternate" hreflang="…">`, iguales en las tres páginas: cada una enlaza a las tres versiones más `x-default`.
- El selector de idioma (`.lang-switch`): `aria-current="true"` en el idioma de la página.

**Reseñas.** Se muestran en su castellano original en las tres páginas (marcadas con `lang="es"`), con una nota en catalán e inglés indicándolo.

**Pop-up de idioma.** Solo está en `index.html` (castellano). Al entrar, `script.js` mira el idioma preferido del navegador (`navigator.languages`): si es catalán o inglés, abre un pop-up en ese idioma ofreciendo su versión («Et podem atendre en català» / «We can help you in English»). Si el navegador prefiere castellano no aparece. No se guarda nada (ni cookies ni `localStorage`), así que si el visitante lo cierra puede volver a verlo en otra visita. Los textos del pop-up están en el `<dialog id="lang-popup">` al final de `index.html`.

**Añadir un idioma.** Copiar `en/` a una carpeta nueva (p. ej. `fr/`), traducir, añadir su `hreflang` y su enlace en el selector de las demás páginas, una entrada en `sitemap.xml` y, si se quiere ofrecer en el pop-up, un bloque `<div class="lang-popup-msg" data-lang="fr">` en `index.html`.

## Cambios habituales

**Fotos de trabajos.** La galería usa `img/trabajo-N.jpg`. Para cambiar una foto basta con sustituir el archivo por otro con el mismo nombre. Para añadir o quitar fotos, edita los `<figure>` de la sección `TRABAJOS` en las tres páginas: `alt` es la descripción para buscadores y lectores de pantalla; `<figcaption>`, el texto visible. Para que la web siga siendo rápida: unos 800 px de ancho, JPEG calidad ~60 y sin metadatos, unos 50 KB por foto (por ejemplo con [squoosh.app](https://squoosh.app)).

**Reseñas.** Se copian a mano desde el perfil de Google en la sección `OPINIONES` de las tres páginas. El botón «Dejar mi opinión» usa el enlace de *Leer reseñas → Conseguir más reseñas* del perfil de empresa.

**Datos de la empresa.** Aparecen en la cabecera, el contacto, el pie, los textos legales y el bloque `application/ld+json` de cada página. Para cambiar uno, busca y reemplaza el valor actual en los tres `index.html` (en VS Code: buscar en todos los archivos, Ctrl+Shift+H):

| Dato | Valor actual |
|---|---|
| Teléfono en enlaces (`tel:`, `wa.me`) | `624134152` |
| Teléfono visible | `624 134 152` |
| Email | `jose@electricidadsana.es` |
| Domicilio en el pie | `Gràcia, Barcelona` |
| Domicilio en aviso legal y privacidad | `C/ Francisco Giner, 12, 08012 Barcelona` |

Si cambias el teléfono, `img/og-image.jpg` también lo lleva escrito.

## Dominio

`electricidadsana.es` apunta a GitHub Pages con estos registros DNS:

| Tipo | Host | Valor |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `electrisan.github.io` |

Configuración en **Settings → Pages** (dominio personalizado y *Enforce HTTPS*). Tras cambios importantes, conviene reenviar `https://electricidadsana.es/sitemap.xml` en [Google Search Console](https://search.google.com/search-console).

## Licencia

© Electricidad Sana (Jose Luis Rodríguez). Todos los derechos reservados. Ver [LICENSE](LICENSE).
