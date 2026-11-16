# Electricidad Sana

Web de **Electricidad Sana**, electricista en Barcelona → **https://electricidadsana.es**

Web estática en tres idiomas (castellano, català, English), generada desde una plantilla con un script de Node **sin dependencias**. HTML, CSS y JavaScript puro, sin cookies ni almacenamiento en el navegador. Se publica con GitHub Pages desde la rama `main`.

| Idioma | URL | Archivo generado |
|---|---|---|
| Castellano (por defecto) | `/` | `index.html` |
| Català | `/ca/` | `ca/index.html` |
| English | `/en/` | `en/index.html` |

## Estructura

```
src/                      ← lo que se edita
├── template.html         plantilla de la página (estructura común a todos los idiomas)
├── site.json             datos comunes: empresa, teléfono, enlaces, barrios, reseñas…
└── i18n/
    ├── es.json           textos en castellano (idioma de referencia)
    ├── ca.json           textos en catalán
    └── en.json           textos en inglés

build.js                  generador: src/ → index.html, ca/, en/, sitemap.xml
styles.css, script.js     estilos y JS (comunes, se editan directamente)
img/                      logo, favicon, imagen para redes y fotos de trabajos
index.html, ca/, en/      ⚠ GENERADOS: no editar a mano
sitemap.xml               ⚠ GENERADO
404.html, robots.txt, CNAME, .nojekyll   estáticos
```

## Desarrollo

Requisito: Node 18 o superior.

```bash
git clone https://github.com/electrisan/electricidadsana.git
cd electricidadsana
npm run dev
```

`npm run dev` genera la web, abre un servidor local (browser-sync, descargado al vuelo con `npx`) y, al guardar cualquier archivo de `src/`, regenera y recarga el navegador. La dirección *External* que muestra sirve para probar en el móvil dentro de la misma wifi.

| Comando | Qué hace |
|---|---|
| `npm run build` | Genera las páginas una vez |
| `npm run watch` | Regenera al guardar, sin servidor |
| `npm run dev` | Regenera al guardar + servidor con recarga automática |

Si el generador encuentra un error (JSON mal escrito, un dato que falta en la plantilla, o un idioma con claves distintas a `es.json`), lo indica con el archivo y la clave.

## Publicar

Las páginas generadas se suben al repositorio junto con `src/`:

```bash
npm run build
git add -A && git commit -m "Descripción del cambio" && git push
```

GitHub Pages publica en 1–2 minutos (estado en la pestaña **Actions**). Si no ves el cambio, recarga sin caché (Ctrl+F5).

## Cómo se editan las cosas

**Textos.** En `src/i18n/<idioma>.json`. Los tres archivos deben tener las mismas claves; las listas de elementos (servicios, fotos) deben tener el mismo número de elementos. Los textos pueden usar datos comunes con `{{site.campo}}`, por ejemplo `"Llamar al {{site.phoneDisplay}}"`. Los párrafos legales admiten HTML (`<strong>`).

**Datos de la empresa, enlaces y barrios.** En `src/site.json`: un solo sitio para los tres idiomas (teléfono, email, NIF, domicilios, enlaces de Google, barrios de la zona de servicio, horario para Google).

**Reseñas.** En `src/site.json` → `reviews`. Se muestran en su idioma original en las tres versiones (en catalán e inglés aparece una nota indicándolo). `stars` es el número de estrellas (1–5).

**Fotos de trabajos.** Archivo en `img/` y una entrada en `works.items` de cada idioma (`img`, `alt` y `caption`). Para cambiar una foto existente basta con sustituir el archivo manteniendo el nombre. Para que la web siga siendo rápida: unos 800 px de ancho, JPEG calidad ~60, sin metadatos (unos 50 KB por foto).

**Estructura de la página.** En `src/template.html`. Sintaxis (subconjunto de Mustache):

| Sintaxis | Uso |
|---|---|
| `{{t.hero.title}}` | Texto escapado (de `i18n/`) |
| `{{site.phone}}` | Dato común (de `site.json`) |
| `{{{texto}}}` | HTML sin escapar |
| `{{#lista}}…{{/lista}}` | Repite el bloque por cada elemento; dentro, `{{campo}}` o `{{.}}` |
| `{{^dato}}…{{/dato}}` | Bloque que se muestra si el dato está vacío |

Además de `t` y `site`, la plantilla recibe `lang`, `root` (`""` o `"../"` para rutas relativas), `url`, `languages`, `alternates`, `langHints`, `reviews`, `jsonLd` y `year` (ver `build.js`).

**Añadir un idioma.** Crear `src/i18n/<código>.json` copiando `es.json`, traducirlo y añadir el código a `languages` en `src/site.json`. El generador crea la carpeta, el selector de idioma, las etiquetas `hreflang` y el sitemap.

**Añadir una página nueva.** Hoy el generador produce una página por idioma desde `template.html`. Para crecer a varias páginas, el siguiente paso natural es una plantilla por página (`src/pages/*.html`) que comparta cabecera y pie como parciales.

## Idiomas sin cookies

El idioma va en la URL, no se guarda en el navegador. En la página en castellano, si el navegador del visitante está configurado en catalán o inglés, aparece un aviso discreto ofreciendo esa versión (`navigator.languages`, sin cookies ni `localStorage`). No hay redirecciones automáticas.

## Dominio

`electricidadsana.es` apunta a GitHub Pages con estos registros DNS:

| Tipo | Host | Valor |
|---|---|---|
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| CNAME | `www` | `electrisan.github.io` |

Configuración en **Settings → Pages** (dominio personalizado y *Enforce HTTPS*). Tras cambios importantes, conviene reenviar `https://electricidadsana.es/sitemap.xml` en [Google Search Console](https://search.google.com/search-console).

## Licencia

© Electricidad Sana (Jose Luis Rodríguez). Todos los derechos reservados. Ver [LICENSE](LICENSE).
