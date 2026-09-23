import { createHmac, randomInt } from 'node:crypto'

const allowedEmail = /^[^\s@]+@(?:concentrix\.com|microsoft\.com)$/i

function jsonBody(body) {
  if (body && typeof body === 'object') return body
  try { return JSON.parse(body || '{}') } catch { return {} }
}

function signedChallenge(email, code, secret) {
  const codeHash = createHmac('sha256', secret).update(code).digest('hex')
  const payload = Buffer.from(JSON.stringify({ email, codeHash, expiresAt: Date.now() + 10 * 60 * 1000 })).toString('base64url')
  const signature = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

async function sendEmail(apiKey, from, to, subject, text) {
  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, text }),
  })
  if (!result.ok) throw new Error('Email provider request failed')
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' })
  const { email: rawEmail } = jsonBody(request.body)
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
  if (!allowedEmail.test(email)) return response.status(403).json({ error: 'Use a work email ending in @concentrix.com or @microsoft.com.' })

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const secret = process.env.FEEDBACK_OTP_SECRET
  if (!apiKey || !from || !secret || secret.length < 32) return response.status(503).json({ error: 'Feedback email verification is not configured yet.' })

  const code = String(randomInt(10000000, 100000000))
  try {
    await sendEmail(apiKey, from, email, 'Your MLTS feedback verification code', `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`)
    const challenge = signedChallenge(email, code, secret)
    response.setHeader('Cache-Control', 'no-store')
    return response.status(200).json({ challenge, expiresInSeconds: 600 })
  } catch {
    return response.status(502).json({ error: 'Could not send the verification email. Please try again later.' })
  }
}
