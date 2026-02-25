import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const leave = await prisma.leaveRequest.findUnique({ where: { id } })
  if (!leave) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  if (leave.userId !== user.id) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  if (leave.status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'ไม่สามารถยกเลิกคำขอที่อนุมัติแล้ว' })
  }

  await prisma.leaveRequest.delete({ where: { id } })
  return { success: true }
})
