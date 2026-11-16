#!/usr/bin/env node
/*
 * Generador de la web Electricidad Sana. Sin dependencias (Node >= 18).
 *
 *   node build.js            → genera index.html, ca/index.html, en/index.html y sitemap.xml
 *   node build.js --watch    → regenera al guardar cualquier archivo de src/
 *   node build.js --serve    → --watch + servidor local con recarga automática (browser-sync vía npx)
 *
 * Entradas:
 *   src/template.html   plantilla HTML de la página
 *   src/site.json       datos comunes a todos los idiomas (empresa, enlaces, reseñas…)
 *   src/i18n/<lang>.json  textos de cada idioma
 *
 * Sintaxis de la plantilla (subconjunto de Mustache):
 *   {{ruta.al.dato}}        texto escapado
 *   {{{ruta.al.dato}}}      HTML sin escapar
 *   {{#lista}}…{{/lista}}   repite por cada elemento (dentro, {{campo}} o {{.}})
 *                           si no es lista, muestra el bloque cuando el valor es verdadero
 *   {{^dato}}…{{/dato}}     muestra el bloque cuando el valor es falso o una lista vacía
 * Los textos de i18n también pueden usar {{site.campo}} (p. ej. {{site.phoneDisplay}}).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const GENERATED_NOTE = '<!-- Archivo generado por build.js a partir de src/. No lo edites a mano: edita src/ y ejecuta "npm run build". -->';

/* ---------------- Motor de plantillas ---------------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function parse(template) {
  // Las etiquetas de bloque solas en su línea no dejan líneas en blanco en el resultado
  template = template.replace(/^[ \t]*(\{\{[#^/][^}]*\}\})[ \t]*\r?\n/gm, '$1');
  const re = /\{\{\{\s*([\w.]+)\s*\}\}\}|\{\{\s*([#^/]?)\s*([\w.]+)\s*\}\}/g;
  const root = { children: [] };
  const stack = [root];
  let last = 0;
  let m;
  while ((m = re.exec(template))) {
    const parent = stack[stack.length - 1];
    if (m.index > last) parent.children.push({ type: 'text', value: template.slice(last, m.index) });
    last = re.lastIndex;
    if (m[1]) { parent.children.push({ type: 'raw', key: m[1] }); continue; }
    const [, , sigil, key] = m;
    if (sigil === '#' || sigil === '^') {
      const node = { type: sigil === '#' ? 'section' : 'inverted', key, children: [] };
      parent.children.push(node);
      stack.push(node);
    } else if (sigil === '/') {
      const open = stack.pop();
      if (!open || open.key !== key) throw new Error(`Plantilla: cierre {{/${key}}} sin apertura correspondiente`);
    } else {
      parent.children.push({ type: 'var', key });
    }
  }
  if (stack.length > 1) throw new Error(`Plantilla: falta cerrar {{/${stack[stack.length - 1].key}}}`);
  if (last < template.length) root.children.push({ type: 'text', value: template.slice(last) });
  return root.children;
}

function lookup(stack, key) {
  if (key === '.') return stack[stack.length - 1];
  const parts = key.split('.');
  for (let i = stack.length - 1; i >= 0; i--) {
    const ctx = stack[i];
    if (ctx !== null && typeof ctx === 'object' && parts[0] in ctx) {
      return parts.reduce((obj, p) => (obj == null ? undefined : obj[p]), ctx);
    }
  }
  return undefined;
}

function renderNodes(nodes, stack, where) {
  let out = '';
  for (const node of nodes) {
    if (node.type === 'text') { out += node.value; continue; }
    const value = lookup(stack, node.key);
    if (node.type === 'var' || node.type === 'raw') {
      if (value === undefined) throw new Error(`${where}: falta el dato "${node.key}"`);
      out += node.type === 'raw' ? String(value) : escapeHtml(value);
    } else if (node.type === 'section') {
      if (Array.isArray(value)) value.forEach((item) => { out += renderNodes(node.children, [...stack, item], where); });
      else if (value) out += renderNodes(node.children, typeof value === 'object' ? [...stack, value] : stack, where);
    } else if (node.type === 'inverted') {
      if (!value || (Array.isArray(value) && value.length === 0)) out += renderNodes(node.children, stack, where);
    }
  }
  return out;
}

function render(template, context, where = 'plantilla') {
  return renderNodes(parse(template), [context], where);
}

/* ---------------- Utilidades ---------------- */

const readJson = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { throw new Error(`${path.relative(ROOT, file)}: ${e.message}`); }
};

// Aplica la plantilla a todos los textos de un objeto (para usar {{site.x}} dentro de i18n)
function interpolateStrings(value, context, where) {
  if (typeof value === 'string') return value.includes('{{') ? render(value, context, where) : value;
  if (Array.isArray(value)) return value.map((v) => interpolateStrings(v, context, where));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, interpolateStrings(v, context, where)]));
  }
  return value;
}

// Comprueba que todos los idiomas tienen las mismas claves que el idioma por defecto
function checkKeys(reference, other, lang, prefix = '') {
  const problems = [];
  if (reference && typeof reference === 'object' && !Array.isArray(reference)) {
    for (const key of Object.keys(reference)) {
      const p = prefix ? `${prefix}.${key}` : key;
      if (!other || !(key in other)) problems.push(`falta "${p}"`);
      else problems.push(...checkKeys(reference[key], other[key], lang, p));
    }
  } else if (Array.isArray(reference)) {
    // Las listas de elementos (servicios, fotos…) deben coincidir; las de párrafos pueden variar
    if (!Array.isArray(other)) problems.push(`"${prefix}" debe ser una lista`);
    else if (reference.some((x) => x && typeof x === 'object')) {
      if (other.length !== reference.length) problems.push(`"${prefix}" debe tener ${reference.length} elementos`);
      else reference.forEach((x, i) => problems.push(...checkKeys(x, other[i], lang, `${prefix}[${i}]`)));
    }
  }
  return problems;
}

const pageUrl = (site, lang) => `${site.baseUrl}/${lang === site.defaultLang ? '' : lang + '/'}`;
const outFile = (site, lang) => (lang === site.defaultLang ? 'index.html' : path.join(lang, 'index.html'));

/* ---------------- Construcción ---------------- */

function build() {
  const started = Date.now();
  const site = readJson(path.join(SRC, 'site.json'));
  const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');
  const locales = Object.fromEntries(site.languages.map((lang) => [lang, readJson(path.join(SRC, 'i18n', `${lang}.json`))]));

  for (const lang of site.languages) {
    if (lang === site.defaultLang) continue;
    const problems = checkKeys(locales[site.defaultLang], locales[lang], lang);
    if (problems.length) throw new Error(`src/i18n/${lang}.json no coincide con ${site.defaultLang}.json:\n  - ${problems.join('\n  - ')}`);
  }

  const languages = site.languages.map((lang) => ({
    code: lang,
    short: locales[lang].langShort,
    name: locales[lang].langName,
    url: pageUrl(site, lang),
  }));

  for (const lang of site.languages) {
    const t = interpolateStrings(locales[lang], { site }, `src/i18n/${lang}.json`);
    const isDefault = lang === site.defaultLang;
    const root = isDefault ? '' : '../';
    const url = pageUrl(site, lang);
    const wa = (text) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Electrician',
      name: site.name,
      url,
      logo: `${site.baseUrl}/img/logo.png`,
      image: `${site.baseUrl}/img/og-image.jpg`,
      telephone: site.phone,
      email: site.email,
      priceRange: '€€',
      address: { '@type': 'PostalAddress', addressLocality: 'Barcelona', addressRegion: 'Cataluña', addressCountry: 'ES' },
      areaServed: site.areaServed,
      knowsLanguage: site.languages,
      openingHoursSpecification: site.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', ...h })),
    };

    const context = {
      site,
      t,
      lang,
      root,
      url,
      year: new Date().getFullYear(),
      generatedNote: GENERATED_NOTE,
      jsonLd: JSON.stringify(ld, null, 2).replace(/</g, '\\u003c'),
      waHrefHero: wa(t.hero.waMessage),
      waHrefFab: wa(t.fab.waMessage),
      waHref: `https://wa.me/${site.whatsapp}`,
      alternates: [...languages.map((l) => ({ hreflang: l.code, url: l.url })), { hreflang: 'x-default', url: pageUrl(site, site.defaultLang) }],
      languages: languages.map((l) => ({ ...l, href: root + (l.code === site.defaultLang ? '' : l.code + '/') || './', current: l.code === lang })),
      // Avisos «esta web también está en…»: solo en la página del idioma por defecto
      langHints: isDefault
        ? languages.filter((l) => l.code !== lang).map((l) => ({ code: l.code, href: l.code + '/', ...locales[l.code].langHint }))
        : [],
      reviews: site.reviews.map((r) => ({
        ...r,
        starsText: '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars),
        starsLabel: t.reviews.starsLabel.replace('{n}', r.stars),
      })),
    };

    const html = render(template, context, `src/template.html (${lang})`);
    const file = path.join(ROOT, outFile(site, lang));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }

  // sitemap.xml con las versiones de idioma enlazadas entre sí
  const links = languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${l.url}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(site, site.defaultLang)}"/>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Archivo generado por build.js. No lo edites a mano. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${languages.map((l) => `  <url>\n    <loc>${l.url}</loc>\n${links}\n  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);

  console.log(`✔ Generado (${site.languages.map((l) => outFile(site, l)).join(', ')}, sitemap.xml) en ${Date.now() - started} ms`);
}

/* ---------------- CLI ---------------- */

function safeBuild() {
  try { build(); return true; }
  catch (e) { console.error(`✖ ${e.message}`); return false; }
}

const args = process.argv.slice(2);
const watch = args.includes('--watch') || args.includes('--serve');

if (!safeBuild() && !watch) process.exit(1);

if (watch) {
  let timer;
  fs.watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(safeBuild, 80);
  });
  console.log('👀 Vigilando src/ … (Ctrl+C para salir)');
}

if (args.includes('--serve')) {
  const { spawn } = require('child_process');
  const files = ['index.html', 'ca/index.html', 'en/index.html', 'styles.css', 'script.js', 'img/*'].join(',');
  spawn('npx', ['--yes', 'browser-sync', 'start', '--server', '--files', files, '--no-notify'], { stdio: 'inherit', shell: true });
}
