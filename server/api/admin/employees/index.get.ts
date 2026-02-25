import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const where: any = { role: 'employee' }
  if (query.department) where.department = query.department
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true'
  if (query.search) {
    where.OR = [
      { name: { contains: query.search as string } },
      { email: { contains: query.search as string } },
      { employeeId: { contains: query.search as string } }
    ]
  }

  const employees = await prisma.user.findMany({
    where,
    select: {
      id: true, employeeId: true, name: true, email: true,
      department: true, position: true, gender: true,
      phone: true, hireDate: true, isActive: true, createdAt: true,
      _count: { select: { leaveRequests: true } }
    },
    orderBy: { name: 'asc' }
  })

  return employees
})
