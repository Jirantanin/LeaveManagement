import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, employeeId: true, name: true, email: true,
      role: true, department: true, position: true,
      gender: true, phone: true, birthDate: true,
      hireDate: true, address: true, isActive: true, createdAt: true,
      _count: { select: { leaveRequests: true } },
      leaveRequests: {
        include: { leaveType: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) throw createError({ statusCode: 404, statusMessage: 'ไม่พบพนักงาน' })
  return user
})
