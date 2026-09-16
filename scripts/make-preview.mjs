/**
 * Turns a normal `dist/` build into a GitHub Pages preview build.
 *
 *   npm run build:preview        # build + this script
 *   node scripts/make-preview.mjs --base=/ok-plumbing-preview
 *
 * This is a POST-BUILD step on purpose. A GitHub Pages project site is served
 * from a sub-path, but the real site (Namecheap) is served from the root, and
 * the preview is temporary. Rewriting the built output keeps every source file
 * identical for production — delete this script and the workflow when the
 * preview is retired and nothing else has to be unpicked.
 *
 * What it does:
 *   1. Prefixes every root-relative URL in .html and .css with the base path.
 *   2. Adds noindex/nofollow to every page and a disallow-all robots.txt, so an
 *      unfinished site for a real business cannot be indexed or compete with
 *      okplumbing.co.uk as duplicate content.
 *   3. Drops the canonical/sitemap links, which point at the live domain.
 *   4. Writes .nojekyll — without it GitHub Pages runs Jekyll, which silently
 *      drops directories beginning with an underscore, and the whole of
 *      `_astro/` (every stylesheet, script and image) would 404.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join, extname } from 'node:path';

const arg = process.argv.find((a) => a.startsWith('--base='));
const base = (arg ? arg.slice('--base='.length) : '').replace(/\/+$/, '');
const dist = 'dist';

if (!base.startsWith('/')) {
  console.error('Pass a base path, e.g. --base=/ok-plumbing-preview');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(dist);
let htmlCount = 0;
let cssCount = 0;

for (const file of files) {
  const ext = extname(file);

  if (ext === '.html') {
    let html = readFileSync(file, 'utf8');

    // Root-relative URLs in link-ish attributes. `//host` is protocol-relative
    // and must be left alone, hence the negative lookahead.
    html = html.replace(
      /\b(href|src|action|poster)="\/(?!\/)/g,
      (_m, attr) => `${attr}="${base}/`
    );

    // These point at the live domain and are meaningless on a preview host.
    html = html.replace(/<link rel="canonical"[^>]*>/g, '');
    html = html.replace(/<link rel="sitemap"[^>]*>/g, '');
    html = html.replace(/<meta property="og:url"[^>]*>/g, '');

    // The footer's visible "Sitemap" link would 404 once the sitemap is gone.
    html = html.replace(/<a[^>]*href="[^"]*sitemap-index\.xml"[^>]*>.*?<\/a>/g, '');
    // ...which leaves a dangling separator before it.
    html = html.replace(/<span aria-hidden="true">·<\/span>\s*(?=<\/span>)/g, '');

    html = html.replace(
      /<head>/,
      '<head><meta name="robots" content="noindex, nofollow">'
    );

    writeFileSync(file, html);
    htmlCount++;
  }

  if (ext === '.css') {
    const css = readFileSync(file, 'utf8');
    const out = css.replace(/url\(\/(?!\/)/g, `url(${base}/`);
    if (out !== css) cssCount++;
    writeFileSync(file, out);
  }
}

writeFileSync(
  join(dist, 'robots.txt'),
  'User-agent: *\nDisallow: /\n\n# Temporary preview build — not the live site.\n'
);

// The sitemap lists okplumbing.co.uk URLs; it has no business on a preview.
for (const file of files) {
  if (/sitemap.*\.xml$/.test(file)) rmSync(file);
}

// Apache-only; GitHub Pages ignores it, but leaving it would be misleading.
rmSync(join(dist, '.htaccess'), { force: true });

writeFileSync(join(dist, '.nojekyll'), '');

console.log(
  `preview ready — base ${base}, ${htmlCount} pages rewritten, ${cssCount} stylesheet(s), noindex applied`
);
