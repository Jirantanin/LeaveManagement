import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const authUser = requireAuth(event)

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true, name: true, email: true,
      role: true, department: true, position: true, createdAt: true
    }
  })

  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return user
})
