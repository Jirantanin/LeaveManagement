import bcrypt from 'bcryptjs'
import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const { name, email, password, department, position, gender, phone, birthDate, hireDate, address, employeeId } = body

  if (!name || !email || !password || !department || !position) {
    throw createError({ statusCode: 400, statusMessage: 'กรุณากรอกข้อมูลที่จำเป็น' })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'อีเมลนี้มีในระบบแล้ว' })

  if (employeeId) {
    const eidExists = await prisma.user.findUnique({ where: { employeeId } })
    if (eidExists) throw createError({ statusCode: 409, statusMessage: 'รหัสพนักงานนี้มีในระบบแล้ว' })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name, email,
      password: hashed,
      role: 'employee',
      department, position,
      gender: gender || null,
      phone: phone || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      hireDate: hireDate ? new Date(hireDate) : null,
      address: address || null,
      employeeId: employeeId || null,
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
