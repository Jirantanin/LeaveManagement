import { verifyToken } from '~/server/utils/jwt'
import { H3Event } from 'h3'

export function requireAuth(event: H3Event) {
  const authHeader = getRequestHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const token = authHeader.slice(7)
  try {
    const user = verifyToken(token)
    event.context.user = user
    return user
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
}

export function requireAdmin(event: H3Event) {
  const user = requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
  return user
}
