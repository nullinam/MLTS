import { createServer } from 'node:http'

const SOURCES = [
  { name: 'Official Microsoft Blog', feed: 'https://blogs.microsoft.com/feed/' },
  { name: 'Microsoft 365 Blog', feed: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/' },
  { name: 'Windows Blog', feed: 'https://blogs.windows.com/feed/' },
  { name: 'Microsoft Security Blog', feed: 'https://www.microsoft.com/en-us/security/blog/feed/' },
]
const allowedOrigins = new Set((process.env.SITE_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean))
const consumerTopics = /\b(windows 11|microsoft 365|m365(?: personal| family| basic| premium)?|word|excel|powerpoint|outlook|onenote|onedrive|microsoft defender|microsoft editor|microsoft teams|clipchamp|designer|copilot|microsoft edge|surface|xbox|family safety|microsoft family)\b/i
const orgTopics = /\b(enterprise|business|admin center|sharepoint admin|tenant|intune|endpoint manager|microsoft 365 admin|azure|dynamics 365|power platform|developer|devops|commercial|workloads)\b/i
const WINDOWS_SHORTCUTS = 'https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec'

let cachedPayload = null
let cachedAt = 0
let inFlight = null

function decodeXml(value = '') {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
}

function field(block, name) {
  const match = block.match(new RegExp(`<${name.replace(':', '(?::|:)')}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name.replace(':', '(?::|:)')}>`, 'i'))
  return match ? decodeXml(match[1].trim()) : ''
}

function itemLink(block) {
  const atom = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)
  return atom ? decodeXml(atom[1]) : field(block, 'link')
}

function plainText(html = '') {
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

function classifyChannel(title, summary) {
  const text = `${title} ${summary}`
  return consumerTopics.test(text) && !orgTopics.test(text) ? 'Consumer' : 'Other Microsoft'
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
    return { title, url: link, date: date.toISOString(), summary, source: source.name, channel: classifyChannel(title, summary) }
  }).filter(Boolean)
}

async function fetchPayload() {
  const results = await Promise.all(SOURCES.map(async (source) => {
    try {
      const response = await fetch(source.feed, {
        headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(9000),
      })
      if (!response.ok) throw new Error(`Feed returned ${response.status}`)
      return { source: source.name, items: parseFeed(await response.text(), source), ok: true }
    } catch {
      return { source: source.name, items: [], ok: false }
    }
  }))

  const seen = new Set()
  const updates = results.flatMap((result) => result.items).filter((item) => {
    if (seen.has(item.url)) return false
    seen.add(item.url)
    return true
  }).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 60)

  return { checkedAt: new Date().toISOString(), updates, sources: results.map(({ source, ok }) => ({ source, ok })) }
}

async function getPayload(forceRefresh) {
  const now = Date.now()
  if (inFlight) return inFlight
  if (cachedPayload && now - cachedAt < 30000 && (!forceRefresh || now - cachedAt < 5000)) return cachedPayload
  inFlight = fetchPayload()
  try {
    cachedPayload = await inFlight
    cachedAt = Date.now()
    return cachedPayload
  } finally {
    inFlight = null
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(body))
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Vary', 'Origin')
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  } else if (origin) {
    return sendJson(response, 403, { error: 'This website origin is not allowed.' })
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' })
    return response.end()
  }

  const url = new URL(request.url, 'http://localhost')
  if (url.pathname === '/health') return sendJson(response, 200, { ok: true })
  if (url.pathname !== '/api/microsoft-pulse') return sendJson(response, 404, { error: 'Not found' })
  if (request.method !== 'GET') return sendJson(response, 405, { error: 'Method not allowed' })
  if (allowedOrigins.size === 0) return sendJson(response, 503, { error: 'Set SITE_ORIGINS to the Render Static Site URL before using this API.' })

  try {
    return sendJson(response, 200, await getPayload(url.searchParams.has('refresh')))
  } catch {
    return sendJson(response, 502, { error: 'Could not check Microsoft feeds right now.' })
  }
})

const port = Number(process.env.PORT) || 10000
server.listen(port, '0.0.0.0', () => console.log(`Change Radar API listening on port ${port}`))
