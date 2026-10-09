import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { slugify } from './src/portal/slug';

const root = import.meta.dirname;

/** Exposes headings and plain text of every src/docs/*.mdx file to the search index (virtual:docs-index). */
function docsIndex(): Plugin {
  const id = 'virtual:docs-index';
  const dir = resolve(root, 'src/docs');
  return {
    name: 'docs-index',
    resolveId: (source) => (source === id ? '\0' + id : null),
    load(resolved) {
      if (resolved !== '\0' + id) return null;
      const docs = readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => {
        this.addWatchFile(resolve(dir, f));
        const sections: { title: string; id: string; text: string }[] = [];
        for (const line of readFileSync(resolve(dir, f), 'utf8').split('\n')) {
          const h = line.match(/^## (.+)$/);
          if (h) sections.push({ title: h[1].trim(), id: slugify(h[1]), text: '' });
          else if (sections.length && !/^\s*(import|export|<\/?[A-Z]|\|\s*-)/.test(line)) sections[sections.length - 1].text += ' ' + line.replace(/[|`*<>{}[\]]/g, ' ');
        }
        return { slug: f.replace(/\.mdx$/, ''), sections: sections.map((s) => ({ ...s, text: s.text.replace(/\s+/g, ' ').trim() })) };
      });
      return `export default ${JSON.stringify(docs)};`;
    },
  };
}

export default defineConfig({
  // Site root path. '/' locally; the GitHub Pages workflow sets BASE_PATH=/<repository>/.
  base: process.env.BASE_PATH ?? '/',
  plugins: [docsIndex(), { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: '@mdx-js/react' }) }, react()],
  // Two documents: the portal (index.html, a single-page app with history routing) and the isolated preview frame.
  build: { rollupOptions: { input: { main: resolve(root, 'index.html'), preview: resolve(root, 'preview.html') } } },
  server: { port: 5180, strictPort: true },
});
