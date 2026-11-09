import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const STATIC_ROUTES = ['/', '/expertise', '/insights', '/about', '/contact']

// Article slugs are read from the data module's source so the sitemap stays in sync with it.
function insightRoutes() {
  const source = readFileSync(new URL('./src/Data/insights.js', import.meta.url), 'utf8')
  return [...source.matchAll(/^\s+slug: "([^"]+)"/gm)].map(([, slug]) => `/insights/${slug}`)
}

// Emits robots.txt, and sitemap.xml only when the confirmed production origin (VITE_SITE_URL) is known.
function seoFiles(siteUrl) {
  return {
    name: 'rapt-seo-files',
    apply: 'build',
    generateBundle() {
      const origin = siteUrl.trim().replace(/\/+$/, '')
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /api/']
      if (origin) {
        const urls = [...STATIC_ROUTES, ...insightRoutes()]
          .map((path) => `  <url><loc>${origin}${path === '/' ? '/' : path}</loc></url>`)
          .join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
        robots.push('', `Sitemap: ${origin}/sitemap.xml`)
      } else {
        this.warn('VITE_SITE_URL is not set: sitemap.xml and canonical URLs are skipped until the production domain is confirmed.')
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), seoFiles(env.VITE_SITE_URL || '')],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }
})
