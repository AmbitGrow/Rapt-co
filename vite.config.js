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

// Hero background per route (src/assets/Herosection/<n>.webp and <n>-portrait.webp).
const HERO_BY_ROUTE = { '/': '1', '/expertise': '2', '/insights': '3', '/about': '4', '/contact': '5' }
// Must match HERO_MOBILE_MEDIA in src/Component/NewHeroSection/NewHeroSection.jsx.
const HERO_MOBILE_MEDIA = '(max-width: 768px) and (max-aspect-ratio: 3/4)'

// The hero images are only referenced from lazily loaded route chunks, so the browser would
// discover them late. This injects an inline script that preloads the current route's hero
// (portrait crop on phones, full image elsewhere) as soon as the HTML is parsed.
function heroPreload() {
  return {
    name: 'rapt-hero-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = {}
        for (const asset of Object.values(ctx.bundle || {})) {
          if (asset.type !== 'asset') continue
          const original = (asset.originalFileNames || [])[0] || ''
          const match =
            original.match(/Herosection\/([1-5])(-portrait)?\.webp$/) ||
            asset.fileName.match(/^assets\/([1-5])(-portrait)?-[\w-]{8}\.webp$/)
          if (match) files[`${match[1]}${match[2] ? 'm' : 'd'}`] = `/${asset.fileName}`
        }
        const map = Object.fromEntries(
          Object.entries(HERO_BY_ROUTE).map(([route, n]) => [route, [files[`${n}d`], files[`${n}m`]]]),
        )
        if (Object.values(map).some(([d, m]) => !d || !m)) {
          this.warn?.('hero preload: could not resolve every hero image; skipping preload')
          return html
        }
        const script = `<script>(function(){var m=${JSON.stringify(map)},p=location.pathname.replace(/\\/+$/,'')||'/',h=m[p];if(!h)return;var q=${JSON.stringify(HERO_MOBILE_MEDIA)};[[h[1],q],[h[0],'not all and '+q]].forEach(function(x){var l=document.createElement('link');l.rel='preload';l.as='image';l.href=x[0];l.media=x[1];l.setAttribute('fetchpriority','high');document.head.appendChild(l)})})()</script>`
        return html.replace('</title>', `</title>
    ${script}`)
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), seoFiles(env.VITE_SITE_URL || ''), heroPreload()],
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }
})
