import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE = 'admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  return process.env.SESSION_SECRET!
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex')
}

function makeToken() {
  const payload = `admin:${Date.now() + MAX_AGE * 1000}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

function verifyToken(token: string): boolean {
  const dot = token.lastIndexOf('.')
  if (dot === -1) return false
  const b64 = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  let payload: string
  try {
    payload = Buffer.from(b64, 'base64url').toString()
  } catch {
    return false
  }
  const expected = sign(payload)
  try {
    if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false
  } catch {
    return false
  }
  const expiry = parseInt(payload.split(':')[1])
  return !isNaN(expiry) && Date.now() < expiry
}

export const checkAuth = createServerFn({ method: 'GET' }).handler(() => {
  const token = getCookie(COOKIE)
  return { ok: verifyToken(token ?? '') }
})

export const login = createServerFn({ method: 'POST' })
  .validator((d: { username: string; password: string }) => d)
  .handler(({ data }) => {
    if (
      data.username !== process.env.ADMIN_USERNAME ||
      data.password !== process.env.ADMIN_PASSWORD
    ) {
      throw new Error('نام کاربری یا رمز عبور اشتباه است')
    }
    setCookie(COOKIE, makeToken(), {
      httpOnly: true,
      path: '/',
      maxAge: MAX_AGE,
      sameSite: 'lax',
    })
    return { ok: true }
  })

export const logout = createServerFn({ method: 'POST' }).handler(() => {
  deleteCookie(COOKIE, { path: '/' })
  return { ok: true }
})
