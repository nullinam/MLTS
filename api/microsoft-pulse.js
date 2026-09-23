const SOURCES = [
  {
    name: 'Microsoft 365 Blog',
    category: 'Microsoft 365',
    feed: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
  },
  {
    name: 'Windows Blog',
    category: 'Windows',
    feed: 'https://blogs.windows.com/feed/',
  },
  {
    name: 'Microsoft Security Blog',
    category: 'Security',
    feed: 'https://www.microsoft.com/en-us/security/blog/feed/',
  },
]

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
}

function field(block, name) {
  const escaped = name.replace(':', '(?::|:)')
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'))
  return match ? decodeXml(match[1].trim()) : ''
}

function itemLink(block) {
  const atom = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)
  if (atom) return decodeXml(atom[1])
  return field(block, 'link')
}

function plainText(html) {
  return decodeXml(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isOfficialUrl(value) {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return url.protocol === 'https:' && (host === 'microsoft.com' || host.endsWith('.microsoft.com') || host === 'windows.com' || host.endsWith('.windows.com'))
  } catch {
    return false
  }
}

function parseFeed(xml, source) {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
  return blocks.map(([, , block]) => {
    const title = plainText(field(block, 'title'))
    const link = itemLink(block)
    const rawDate = field(block, 'pubDate') || field(block, 'published') || field(block, 'updated') || field(block, 'dc:date')
    const date = new Date(rawDate)
    const rawSummary = field(block, 'description') || field(block, 'summary') || field(block, 'content:encoded') || field(block, 'content')
    const summary = plainText(rawSummary).slice(0, 420)
    if (!title || !isOfficialUrl(link) || !Number.isFinite(date.getTime())) return null
    return { title, url: link, date: date.toISOString(), summary, source: source.name, category: source.category }
  }).filter(Boolean)
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  response.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const results = await Promise.all(SOURCES.map(async (source) => {
    try {
      const result = await fetch(source.feed, {
        headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(9000),
      })
      if (!result.ok) throw new Error(`Source returned ${result.status}`)
      const xml = await result.text()
      return { source: source.name, items: parseFeed(xml, source), ok: true }
    } catch {
      return { source: source.name, items: [], ok: false }
    }
  }))

  const seen = new Set()
  const updates = results.flatMap((result) => result.items).filter((item) => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  }).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30)

  return response.status(200).json({
    checkedAt: new Date().toISOString(),
    updates,
    sources: results.map(({ source, ok }) => ({ source, ok })),
  })
}
