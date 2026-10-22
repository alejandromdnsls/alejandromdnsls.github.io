// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

// Content notes (e.g. TODO(content)) are written as HTML comments in Markdown;
// drop them so they never reach the published HTML.
function rehypeStripComments() {
  /** @param {any} node */
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter(
      (/** @type {any} */ child) =>
        child.type !== 'comment' && !(child.type === 'raw' && /^\s*<!--(?:(?!-->)[\s\S])*-->\s*$/.test(child.value)),
    );
    node.children.forEach(walk);
  };
  return walk;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pyramidev.com.mx',
  integrations: [sitemap()],
  // Astro 7 defaults to JSX whitespace rules ('jsx'), which drops spaces between
  // inline elements; keep the v6 lossless compression so the copy renders the same.
  compressHTML: true,
  // Astro 7 renders Markdown with Satteri by default; keep the remark/rehype
  // pipeline so the comment-stripping plugin keeps running unchanged.
  markdown: { processor: unified({ rehypePlugins: [rehypeStripComments] }) },
  // Old static-site URLs (GitHub Pages, .html) keep working after the migration.
  redirects: {
    '/about.html': '/nosotros',
    '/services.html': '/servicios',
    '/portfolio.html': '/casos',
    '/contact.html': '/contacto',
    '/privacy.html': '/aviso-de-privacidad',
    '/terms.html': '/terminos',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
