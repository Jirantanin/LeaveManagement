import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const { leaveTypeId, startDate, endDate, reason } = await readBody(event)

  if (!leaveTypeId || !startDate || !endDate || !reason) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < start) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be after start date' })
  }

  // Calculate days (business days simple)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  // Check balance
  const year = new Date().getFullYear()
  const leaveType = await prisma.leaveType.findUnique({ where: { id: Number(leaveTypeId) } })
  if (!leaveType) throw createError({ statusCode: 404, statusMessage: 'Leave type not found' })

  const used = await prisma.leaveRequest.aggregate({
    where: {
      userId: user.id,
      leaveTypeId: Number(leaveTypeId),
      status: 'approved',
      startDate: { gte: new Date(year, 0, 1) }
    },
    _sum: { days: true }
  })

  const usedDays = used._sum.days || 0
  if (usedDays + days > leaveType.daysAllowed) {
    throw createError({
      statusCode: 400,
      statusMessage: `วันลาไม่เพียงพอ (คงเหลือ ${leaveType.daysAllowed - usedDays} วัน)`
    })
  }

  const leave = await prisma.leaveRequest.create({
    data: {
      userId: user.id,
      leaveTypeId: Number(leaveTypeId),
      startDate: start,
      endDate: end,
      days,
      reason,
      status: 'pending'
    },
    include: { leaveType: true }
  })

  return leave
})
