import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const [totalEmployees, totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves, recentLeaves] =
    await Promise.all([
      prisma.user.count({ where: { role: 'employee' } }),
      prisma.leaveRequest.count(),
      prisma.leaveRequest.count({ where: { status: 'pending' } }),
      prisma.leaveRequest.count({ where: { status: 'approved' } }),
      prisma.leaveRequest.count({ where: { status: 'rejected' } }),
      prisma.leaveRequest.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, department: true } }, leaveType: true }
      })
    ])

  // Leaves by type
  const leavesByType = await prisma.leaveRequest.groupBy({
    by: ['leaveTypeId'],
    _count: { id: true }
  })
  const leaveTypes = await prisma.leaveType.findMany()
  const leaveTypeStats = leavesByType.map(l => ({
    name: leaveTypes.find(t => t.id === l.leaveTypeId)?.name || 'Unknown',
    count: l._count.id
  }))

  return {
    stats: { totalEmployees, totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves },
    recentLeaves,
    leaveTypeStats
  }
})
