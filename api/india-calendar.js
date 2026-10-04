const GOOGLE_INDIA_HOLIDAYS = 'https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics'
const INDIA_HOLIDAYS_API = 'https://date.nager.at/api/v3/PublicHolidays'

function unescapeIcal(value = '') {
  return value.replace(/\\n/gi, ' ').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').trim()
}

function icalDate(value) {
  const dateOnly = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (dateOnly) return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`
  const instant = new Date(value)
  if (!Number.isFinite(instant.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant)
  const date = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${date.year}-${date.month}-${date.day}`
}

function parseIndiaIcal(calendar) {
  const unfolded = calendar.replace(/\r?\n[ \t]/g, '')
  return [...unfolded.matchAll(/BEGIN:VEVENT\s*([\s\S]*?)\s*END:VEVENT/g)].flatMap(([, event]) => {
    const start = event.match(/^DTSTART(?:;[^:]*)?:(.+)$/m)
    const summary = event.match(/^SUMMARY(?:;[^:]*)?:(.*)$/m)
    if (!start || !summary) return []
    const date = icalDate(start[1].trim())
    const name = unescapeIcal(summary[1])
    if (!date || !name) return []
    return [{ date, name, localName: name, countryCode: 'IN', category: 'india', source: 'Google India holiday calendar', sourceUrl: GOOGLE_INDIA_HOLIDAYS, counties: null, global: true }]
  })
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`Calendar source returned ${response.status}`)
  return response.json()
}

async function fetchIcal(url) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`Calendar source returned ${response.status}`)
  return response.text()
}

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  const year = Number(new URL(request.url, 'https://mlts.invalid').searchParams.get('year'))
  const currentYear = Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Kolkata', year: 'numeric' }).format(new Date()))
  if (!Number.isInteger(year) || year < currentYear - 1 || year > currentYear + 5) return response.status(400).json({ error: 'Choose a calendar year from this year through five years ahead.' })

  const [holidayResult, icalResult] = await Promise.allSettled([
    fetchJson(`${INDIA_HOLIDAYS_API}/${year}/IN`),
    fetchIcal(GOOGLE_INDIA_HOLIDAYS),
  ])
  const events = []
  if (holidayResult.status === 'fulfilled' && Array.isArray(holidayResult.value)) {
    for (const holiday of holidayResult.value) events.push({ ...holiday, category: 'india', source: 'Nager.Date public holiday feed', sourceUrl: 'https://date.nager.at/Api' })
  }
  if (icalResult.status === 'fulfilled') events.push(...parseIndiaIcal(icalResult.value))

  if (!events.length) return response.status(502).json({ error: 'India holiday sources are temporarily unavailable.' })
  const seen = new Set()
  const uniqueEvents = events.filter((event) => {
    if (!event.date?.startsWith(`${year}-`)) return false
    const key = `${event.date}|${event.name.toLocaleLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const sources = [
    holidayResult.status === 'fulfilled' ? 'Nager.Date' : null,
    icalResult.status === 'fulfilled' ? 'Google India holiday calendar' : null,
  ].filter(Boolean)
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  response.setHeader('X-Calendar-Sources', sources.join(', '))
  return response.status(200).json({ year, events: uniqueEvents, source: `Live holiday feeds · ${sources.join(' + ')}` })
}
