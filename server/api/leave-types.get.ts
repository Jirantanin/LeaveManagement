import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  return prisma.leaveType.findMany({ orderBy: { id: 'asc' } })
})
