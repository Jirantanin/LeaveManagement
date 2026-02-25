import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const query = getQuery(event)

  const where: any = {}
  if (query.status) where.status = query.status as string
  if (query.userId) where.userId = Number(query.userId)

  const leaves = await prisma.leaveRequest.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, department: true, position: true } },
      leaveType: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return leaves
})
