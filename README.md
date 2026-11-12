# Electricidad Sana – Web estática

Web de una sola página para **Electricidad Sana**, electricista en Barcelona.
Hecha con HTML, CSS y JavaScript puro (sin frameworks ni dependencias). Lista para publicar gratis en **GitHub Pages** con el dominio **electricidadsana.es**.

## Estructura

```
├── index.html     → la página
├── styles.css     → estilos (mobile-first)
├── script.js      → menú móvil, galería, formulario
├── img/           → logo, favicon y fotos de trabajos
├── 404.html       → página de error
├── robots.txt     → instrucciones para buscadores
├── sitemap.xml    → mapa del sitio para Google
├── CNAME          → dominio personalizado (electricidadsana.es)
├── .nojekyll      → indica a GitHub Pages que sirva los archivos tal cual
└── README.md
```

---

## 1. Antes de publicar: personaliza tus datos

> ✅ Ya están puestos: titular (Jose Luis Rodríguez), NIF, domicilio (en la web solo «Gràcia, Barcelona»; la calle únicamente en los textos legales), logo, teléfono/WhatsApp 624 134 152, email jose@electricidadsana.es y RASIC 105002805. Quedan pendientes los enlaces y reseñas de Google y las fotos.
>
> Si algún día cambian esos datos, abre `index.html` con cualquier editor de texto (por ejemplo [Visual Studio Code](https://code.visualstudio.com/), gratuito) y usa **Buscar y reemplazar** (Ctrl+H / Cmd+Alt+F):

| Dato | Texto actual en `index.html` |
|---|---|
| Teléfono (enlaces `tel:` y `wa.me`) | `624134152` |
| Teléfono (texto visible) | `624 134 152` (también en `script.js`) |
| Email | `jose@electricidadsana.es` |
| Titular / NIF | `Jose Luis Rodríguez` / `46818760Y` |
| Domicilio (pie de la web) | `Gràcia, Barcelona` |
| Domicilio (aviso legal y privacidad) | `C/ Francisco Giner, 12, 08012 Barcelona` |
| Nº empresa instaladora | `RASIC 105002805` |
| Enlace a tu perfil de Google Maps (pendiente) | `ENLACE-PERFIL-GOOGLE-MAPS` |
| Enlace para dejar reseña (pendiente) | `ENLACE-DEJAR-RESENA` |

**Revisa además:**
- **Horario y barrios:** edita la sección de contacto, la lista de la zona de servicio y el bloque `application/ld+json`.
- **Textos legales:** son una base orientativa (LSSI-CE y RGPD). Revísalos con tu gestor.

### Fotos de trabajos (cambiarlas tú mismo)

La web muestra 6 fotos: `img/trabajo-1.jpg` … `img/trabajo-6.jpg`. Ahora son imágenes de ejemplo. Para cambiarlas **no hace falta tocar código**: basta con subir tu foto con el mismo nombre.

1. **Prepara la foto.** Mejor en horizontal. Si es vertical también vale: se recorta sola al centro.
2. **Redúcela** para que la web cargue rápido: entra en [squoosh.app](https://squoosh.app) (gratis, funciona en el móvil), abre la foto, en *Resize* pon ancho **1200**, formato **MozJPEG**, calidad **75** y descárgala. Debe pesar menos de 300 KB.
3. **Renómbrala** exactamente `trabajo-1.jpg` (o el número que quieras sustituir). Todo en minúsculas y con `.jpg`, no `.jpeg` ni `.JPG`.
4. **Súbela a GitHub:** en tu repositorio entra en la carpeta `img` → **Add file → Upload files** → arrastra la foto → **Commit changes**. Como se llama igual, sustituye a la anterior.
5. En 1–2 minutos aparece en la web. Si no la ves, recarga la página sin caché (Ctrl+F5, o en el móvil abre la web en una pestaña privada).

**Cambiar el texto de una foto** (p. ej. «Cuadro eléctrico · Eixample»): en GitHub abre `index.html` → icono del lápiz ✏️ → busca (Ctrl+F) `trabajo-1` → cambia el texto de `alt="…"` (descripción para Google y personas ciegas) y el de `<figcaption>…</figcaption>` (el que se ve) → **Commit changes**.

Consejos: fotos con buena luz, el trabajo terminado y ordenado, sin caras de clientes ni matrículas, direcciones o datos personales.

### Reseñas de Google

Google no permite mostrar automáticamente las reseñas en una web estática sin usar su API de pago (con clave y facturación) o un widget de terceros, que añadiría dependencias y cookies. La forma sencilla y gratuita:

**A. Consigue tus dos enlaces** (con la cuenta de Google que gestiona tu ficha):

1. **Enlace para dejar reseña:** busca «Electricidad Sana» en Google o abre tu ficha en la app de Google Maps → **Leer reseñas → Conseguir más reseñas** (según la versión pone *Pedir reseñas*) → **Copiar enlace**. Será del tipo `https://g.page/r/XXXXXXXX/review`. Esa ventana también te da un **código QR** para imprimir en tarjetas o presupuestos.
2. **Enlace a tu perfil:** abre tu ficha en [Google Maps](https://maps.google.com) → **Compartir → Copiar enlace**. Será del tipo `https://maps.app.goo.gl/XXXXXXXX`.

**B. Ponlos en la web:** en `index.html` (lápiz ✏️ en GitHub) busca y sustituye:
- `ENLACE-PERFIL-GOOGLE-MAPS` → enlace a tu perfil (botón «Ver todas las opiniones en Google»).
- `ENLACE-DEJAR-RESENA` → enlace para dejar reseña (botón «Dejar mi opinión»).

**C. Copia tus 3 mejores reseñas:** en `index.html` busca `Reseña real de un cliente` y, en cada una de las 3 tarjetas, cambia el texto entre comillas por la reseña tal cual aparece en Google y `Nombre del cliente, Barrio` por el nombre de pila y la inicial (ej. `— Marta G., Gràcia`). Si una reseña es de 4 estrellas, cambia `★★★★★` por `★★★★☆` y `5 de 5 estrellas` por `4 de 5 estrellas`. Usa solo reseñas reales y publicadas; cámbialas cuando tengas otras mejores.

Si no tienes ficha todavía, créala gratis en [business.google.com](https://business.google.com) indicando que atiendes a domicilio (así no se muestra tu dirección, solo la zona de servicio).

### Formulario de contacto

GitHub Pages solo sirve archivos estáticos (no puede enviar emails). El formulario tiene dos modos:

- **Por defecto (sin configurar nada):** al enviar, se abre la aplicación de correo del cliente con el mensaje ya redactado hacia tu email.
- **Recomendado – recibir los mensajes directamente:** crea una cuenta gratuita en [formspree.io](https://formspree.io), crea un formulario con tu email y copia la dirección que te dan (tipo `https://formspree.io/f/abcdwxyz`). Pégala en `index.html`:

  ```html
  <form ... id="contact-form" data-endpoint="https://formspree.io/f/abcdwxyz" ...>
  ```

  A partir de ahí los mensajes te llegarán al correo sin que el cliente tenga que abrir nada. Si usas Formspree, añádelo como proveedor en la política de privacidad.

### Probar en tu ordenador

Basta con hacer doble clic en `index.html` para abrirlo en el navegador.

---

## 2. Subir la web a GitHub

### Opción A – Desde la web de GitHub (sin instalar nada)

1. Entra en [github.com](https://github.com) con tu cuenta.
2. Pulsa **+ → New repository**.
   - Nombre: `electricidadsana` (o el que prefieras).
   - Visibilidad: **Public** (necesario para GitHub Pages en cuentas gratuitas).
   - No marques ninguna casilla de inicialización. Pulsa **Create repository**.
3. En la página del repositorio vacío, pulsa **uploading an existing file**.
4. Arrastra **todo el contenido** de la carpeta del proyecto (los archivos y la carpeta `img`, no la carpeta que los contiene).
   > ⚠️ El archivo `.nojekyll` empieza por punto y puede estar oculto. En Mac pulsa `Cmd + Shift + .` en Finder para verlo; en Windows activa *Vista → Elementos ocultos*. Si no lo subes no pasa nada grave, pero es recomendable.
5. Escribe un mensaje (p. ej. «Primera versión») y pulsa **Commit changes**.

### Opción B – Con Git en la terminal

```bash
cd ruta/a/la/carpeta/electricidadsana
git init
git add .
git commit -m "Primera versión de la web"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/electricidadsana.git
git push -u origin main
```

## 3. Activar GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **Deploy from a branch**.
3. En **Branch** selecciona `main` y la carpeta `/ (root)`. Pulsa **Save**.
4. En 1–2 minutos la web estará en `https://TU-USUARIO.github.io/electricidadsana/`.

## 4. Conectar el dominio electricidadsana.es

El archivo `CNAME` ya contiene `electricidadsana.es`, así que GitHub lo detecta automáticamente.

**En el panel de tu proveedor del dominio** (DonDominio, IONOS, Arsys, GoDaddy…), en la zona DNS, crea estos registros:

| Tipo | Nombre / Host | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `TU-USUARIO.github.io` |

(Opcional, para IPv6: registros `AAAA` en `@` con `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153` y `2606:50c0:8003::153`.)

Elimina cualquier otro registro A o CNAME antiguo para `@` y `www` que apunte a otro sitio (p. ej. la página de «dominio aparcado»).

Después:

1. Vuelve a **Settings → Pages**. En **Custom domain** debe aparecer `electricidadsana.es` (si no, escríbelo y pulsa **Save**).
2. Espera a que la comprobación de DNS se ponga en verde (puede tardar desde minutos hasta 24–48 h).
3. Marca **Enforce HTTPS** en cuanto esté disponible, para tener el candado de seguridad.

> Consejo de seguridad: en **Settings (de tu cuenta) → Pages** puedes **verificar el dominio** para que nadie más pueda usarlo en GitHub. Las instrucciones oficiales están en la documentación de GitHub: *Verifying your custom domain for GitHub Pages*.

## 5. Dar de alta la web en Google

1. Entra en [Google Search Console](https://search.google.com/search-console), añade la propiedad `electricidadsana.es` y verifícala (por DNS).
2. En **Sitemaps**, envía `https://electricidadsana.es/sitemap.xml`.
3. Crea o actualiza tu ficha de **Google Business Profile** con el enlace a la web: es lo que más ayuda a aparecer en búsquedas como «electricista Barcelona».

## 6. Hacer cambios más adelante

- **Desde la web de GitHub:** abre el archivo, pulsa el icono del lápiz ✏️, edita y pulsa **Commit changes**. Para fotos nuevas: **Add file → Upload files** dentro de `img/`.
- **Con Git:** edita en tu ordenador y ejecuta `git add . && git commit -m "Cambios" && git push`.

Los cambios se publican solos en 1–2 minutos. Cuando hagas cambios importantes, actualiza la fecha `<lastmod>` de `sitemap.xml`.
