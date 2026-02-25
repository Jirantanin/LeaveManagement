import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const { status, note } = await readBody(event)

  if (!['approved', 'rejected'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  const leave = await prisma.leaveRequest.update({
    where: { id },
    data: { status, note },
    include: {
      user: { select: { name: true, email: true } },
      leaveType: true
    }
  })

  return leave
})
