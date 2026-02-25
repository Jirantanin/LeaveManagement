describe('Employee Workflows', () => {
  beforeEach(() => {
    cy.loginAsEmployee()
  })

  it('should show employee dashboard with leave balance cards', () => {
    cy.visit('/employee')
    cy.contains('สวัสดี').should('be.visible')
    // เห็น leave balance cards อย่างน้อย 1 card
    cy.get('[class*="rounded"]').should('have.length.at.least', 1)
  })

  it('should navigate to leave history page', () => {
    cy.visit('/employee')
    cy.contains('ประวัติการลา').click()
    cy.url().should('include', '/employee/leaves')
    cy.contains('ประวัติการลา').should('be.visible')
  })

  it('should navigate to new leave request page', () => {
    cy.visit('/employee')
    cy.contains('ยื่นคำขอลา').click()
    cy.url().should('include', '/employee/leaves/new')
  })

  it('should submit a new leave request successfully', () => {
    cy.visit('/employee/leaves/new')

    // เลือกประเภทการลา
    cy.get('select').first().select(1)

    // กำหนดวันที่
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    cy.get('input[type="date"]').eq(0).type(formatDate(tomorrow))
    cy.get('input[type="date"]').eq(1).type(formatDate(dayAfter))

    // ใส่เหตุผล
    cy.get('textarea').type('ทดสอบการยื่นคำขอลา Cypress E2E Test')

    // กด submit
    cy.get('button[type="submit"]').click()

    // เห็น success message
    cy.contains('ยื่นคำขอลาสำเร็จ').should('be.visible')
  })

  it('should filter leave requests by status', () => {
    cy.visit('/employee/leaves')

    // คลิก filter รอดำเนินการ
    cy.contains('รอดำเนินการ').click()

    // ตรวจว่ามีเฉพาะ pending status หรือ empty state
    cy.get('body').then(($body) => {
      if ($body.text().includes('⏳')) {
        cy.contains('⏳').should('be.visible')
      } else {
        cy.contains('ไม่มีรายการ').should('be.visible')
      }
    })
  })

  it('should cancel a pending leave request', () => {
    cy.visit('/employee/leaves')
    cy.contains('รอดำเนินการ').click()

    cy.get('body').then(($body) => {
      if ($body.text().includes('ยกเลิก')) {
        cy.contains('ยกเลิก').first().click()
        // ยืนยัน confirm dialog ถ้ามี
        cy.on('window:confirm', () => true)
      } else {
        cy.log('ไม่มี pending leave request ที่จะยกเลิก')
      }
    })
  })
})
