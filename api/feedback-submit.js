import { createHmac, timingSafeEqual } from 'node:crypto'

const allowedRecipients = ['mohammed.ulhasan@concentrix.com', 'v-moulhasan@microsoft.com']
const allowedEmail = /^[^\s@]+@(?:concentrix\.com|microsoft\.com)$/i

function jsonBody(body) {
  if (body && typeof body === 'object') return body
  try { return JSON.parse(body || '{}') } catch { return {} }
}

function verifiedEmail(challenge, email, code, secret) {
  if (typeof challenge !== 'string' || typeof code !== 'string') return false
  const [payload, signature, extra] = challenge.split('.')
  if (!payload || !signature || extra) return false
  const expectedSignature = createHmac('sha256', secret).update(payload).digest()
  let suppliedSignature
  try { suppliedSignature = Buffer.from(signature, 'base64url') } catch { return false }
  if (suppliedSignature.length !== expectedSignature.length || !timingSafeEqual(suppliedSignature, expectedSignature)) return false
  try {
    const details = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const expectedCodeHash = String(details.codeHash)
    const suppliedCodeHash = createHmac('sha256', secret).update(String(code).trim()).digest('hex')
    const codeMatches = expectedCodeHash.length === suppliedCodeHash.length && timingSafeEqual(Buffer.from(expectedCodeHash), Buffer.from(suppliedCodeHash))
    return details.email === email && Number(details.expiresAt) > Date.now() && codeMatches
  } catch { return false }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  const body = jsonBody(request.body)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const feedback = typeof body.message === 'string' ? body.message.trim() : ''
  const secret = process.env.FEEDBACK_OTP_SECRET
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (!allowedEmail.test(email)) return response.status(403).json({ error: 'Only verified @concentrix.com and @microsoft.com mailboxes can submit feedback.' })
  if (!secret || secret.length < 32 || !apiKey || !from) return response.status(503).json({ error: 'Feedback email is not configured yet.' })
  if (!verifiedEmail(body.challenge, email, body.code, secret)) return response.status(403).json({ error: 'The code is incorrect or expired. Request a new code and try again.' })
  if (!feedback || feedback.length > 3000) return response.status(400).json({ error: 'Feedback must be between 1 and 3000 characters.' })

  const text = `New MLTS Consumer Simulator feedback\n\nFrom: ${email}\n\n${feedback}`
  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: allowedRecipients,
        reply_to: email,
        subject: 'MLTS Consumer Simulator feedback',
        text,
      }),
    })
    if (!result.ok) throw new Error('Email provider request failed')
    response.setHeader('Cache-Control', 'no-store')
    return response.status(200).json({ sent: true })
  } catch {
    return response.status(502).json({ error: 'Could not send feedback. Please try again later.' })
  }
}
