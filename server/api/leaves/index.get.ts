import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const query = getQuery(event)

  const leaves = await prisma.leaveRequest.findMany({
    where: { userId: user.id },
    include: { leaveType: true },
    orderBy: { createdAt: 'desc' },
    take: query.limit ? Number(query.limit) : undefined
  })

  // Calculate used days per leave type this year
  const year = new Date().getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31)

  const usedDays = await prisma.leaveRequest.groupBy({
    by: ['leaveTypeId'],
    where: {
      userId: user.id,
      status: 'approved',
      startDate: { gte: startOfYear, lte: endOfYear }
    },
    _sum: { days: true }
  })

  const leaveTypes = await prisma.leaveType.findMany()
  const balances = leaveTypes.map(lt => {
    const used = usedDays.find(u => u.leaveTypeId === lt.id)?._sum.days || 0
    return {
      leaveTypeId: lt.id,
      leaveTypeName: lt.name,
      allowed: lt.daysAllowed,
      used,
      remaining: lt.daysAllowed - used
    }
  })

  return { leaves, balances }
})
