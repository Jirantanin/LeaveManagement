import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { name, email, department, position, gender, phone, birthDate, hireDate, address, employeeId, isActive } = body

  if (employeeId) {
    const conflict = await prisma.user.findFirst({ where: { employeeId, NOT: { id } } })
    if (conflict) throw createError({ statusCode: 409, statusMessage: 'รหัสพนักงานนี้มีในระบบแล้ว' })
  }

  if (email) {
    const conflict = await prisma.user.findFirst({ where: { email, NOT: { id } } })
    if (conflict) throw createError({ statusCode: 409, statusMessage: 'อีเมลนี้มีในระบบแล้ว' })
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(department && { department }),
      ...(position && { position }),
      gender: gender ?? undefined,
      phone: phone ?? undefined,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      hireDate: hireDate ? new Date(hireDate) : undefined,
      address: address ?? undefined,
      employeeId: employeeId ?? undefined,
      ...(typeof isActive === 'boolean' && { isActive }),
    },
    select: {
      id: true, employeeId: true, name: true, email: true,
      department: true, position: true, gender: true,
      phone: true, birthDate: true, hireDate: true,
      address: true, isActive: true, createdAt: true
    }
  })

  return user
})
