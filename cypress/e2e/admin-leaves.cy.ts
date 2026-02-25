describe('Admin Leave Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/admin/leaves')
  })

  it('should load leave requests table', () => {
    cy.contains('คำขอลาทั้งหมด').should('be.visible')
    // filter buttons ครบ
    cy.contains('ทั้งหมด').should('be.visible')
    cy.contains('รอดำเนินการ').should('be.visible')
    cy.contains('อนุมัติแล้ว').should('be.visible')
    cy.contains('ไม่อนุมัติ').should('be.visible')
  })

  it('should filter to show only pending leaves', () => {
    cy.contains('button', 'รอดำเนินการ').click()

    cy.get('body').then(($body) => {
      if ($body.text().includes('⏳ รอดำเนินการ')) {
        // ต้องไม่มี status อื่น
        cy.contains('✅ อนุมัติแล้ว').should('not.exist')
        cy.contains('❌ ไม่อนุมัติ').should('not.exist')
      } else {
        cy.log('ไม่มี pending leave requests')
      }
    })
  })

  it('should filter to show only approved leaves', () => {
    cy.contains('button', 'อนุมัติแล้ว').click()

    cy.get('body').then(($body) => {
      if ($body.text().includes('✅ อนุมัติแล้ว')) {
        cy.contains('⏳ รอดำเนินการ').should('not.exist')
      } else {
        cy.log('ไม่มี approved leave requests')
      }
    })
  })

  it('should approve a pending leave request', () => {
    cy.contains('button', 'รอดำเนินการ').click()

    cy.get('body').then(($body) => {
      if ($body.text().includes('อนุมัติ')) {
        cy.contains('button', 'อนุมัติ').first().click()
        // หลัง approve: ปุ่ม "อนุมัติ" ของ row นั้นหายไป
        cy.contains('✅ อนุมัติแล้ว').should('be.visible')
      } else {
        cy.log('ไม่มี pending leave request ที่จะอนุมัติ')
      }
    })
  })

  it('should reject a pending leave request', () => {
    cy.contains('button', 'รอดำเนินการ').click()

    cy.get('body').then(($body) => {
      if ($body.text().includes('ปฏิเสธ')) {
        cy.contains('button', 'ปฏิเสธ').first().click()
        cy.contains('❌ ไม่อนุมัติ').should('be.visible')
      } else {
        cy.log('ไม่มี pending leave request ที่จะปฏิเสธ')
      }
    })
  })

  it('should show all leaves when clicking "ทั้งหมด" filter', () => {
    // filter pending ก่อน
    cy.contains('button', 'รอดำเนินการ').click()
    // แล้วกลับมา ทั้งหมด
    cy.contains('button', 'ทั้งหมด').click()
    cy.contains('คำขอลาทั้งหมด').should('be.visible')
  })
})
