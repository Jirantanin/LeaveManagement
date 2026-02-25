const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Leave Types
  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'ลาพักร้อน', daysAllowed: 10 }
    }),
    prisma.leaveType.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'ลาป่วย', daysAllowed: 30 }
    }),
    prisma.leaveType.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: 'ลากิจ', daysAllowed: 3 }
    }),
    prisma.leaveType.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: 'ลาคลอด', daysAllowed: 98 }
    })
  ])

  console.log('✅ Leave types created:', leaveTypes.map(l => l.name).join(', '))

  // Create Admin
  const adminPassword = await bcrypt.hash('admin1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'ผู้ดูแลระบบ',
      email: 'admin@company.com',
      password: adminPassword,
      role: 'admin',
      department: 'IT',
      position: 'System Administrator'
    }
  })
  console.log('✅ Admin created:', admin.email)

  // Create Employees
  const empPassword = await bcrypt.hash('emp1234', 10)
  const employees = await Promise.all([
    prisma.user.upsert({
      where: { email: 'somchai@company.com' },
      update: {},
      create: {
        name: 'สมชาย ใจดี',
        email: 'somchai@company.com',
        password: empPassword,
        role: 'employee',
        department: 'การตลาด',
        position: 'Marketing Manager'
      }
    }),
    prisma.user.upsert({
      where: { email: 'napa@company.com' },
      update: {},
      create: {
        name: 'นภา สุขสันต์',
        email: 'napa@company.com',
        password: empPassword,
        role: 'employee',
        department: 'HR',
        position: 'HR Officer'
      }
    }),
    prisma.user.upsert({
      where: { email: 'wichai@company.com' },
      update: {},
      create: {
        name: 'วิชัย ทำงานดี',
        email: 'wichai@company.com',
        password: empPassword,
        role: 'employee',
        department: 'IT',
        position: 'Developer'
      }
    })
  ])
  console.log('✅ Employees created:', employees.map(e => e.name).join(', '))

  // Create sample leave requests
  const today = new Date()
  await prisma.leaveRequest.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: employees[0].id, leaveTypeId: 1,
        startDate: new Date(today.getFullYear(), today.getMonth(), 10),
        endDate: new Date(today.getFullYear(), today.getMonth(), 12),
        days: 3, reason: 'ท่องเที่ยวต่างประเทศ', status: 'approved'
      },
      {
        userId: employees[1].id, leaveTypeId: 2,
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        days: 2, reason: 'ป่วยไข้หวัด', status: 'pending'
      },
      {
        userId: employees[2].id, leaveTypeId: 3,
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        days: 1, reason: 'ธุระส่วนตัว', status: 'pending'
      }
    ]
  })
  console.log('✅ Sample leave requests created')

  console.log('\n🎉 Seed completed!')
  console.log('─────────────────────────────')
  console.log('Admin:    admin@company.com  / admin1234')
  console.log('Employee: somchai@company.com / emp1234')
  console.log('Employee: napa@company.com   / emp1234')
  console.log('Employee: wichai@company.com / emp1234')
  console.log('─────────────────────────────')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
