describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  it('should show admin dashboard with stats cards', () => {
    cy.visit('/admin')
    cy.contains('Admin Dashboard').should('be.visible')

    // ตรวจ stat cards
    cy.contains('พนักงานทั้งหมด').should('be.visible')
    cy.contains('คำขอลาทั้งหมด').should('be.visible')
    cy.contains('รอดำเนินการ').should('be.visible')
    cy.contains('อนุมัติแล้ว').should('be.visible')
  })

  it('should show recent leave requests section', () => {
    cy.visit('/admin')
    cy.contains('คำขอลาล่าสุด').should('be.visible')
  })

  it('should navigate to all leave requests via "ดูทั้งหมด"', () => {
    cy.visit('/admin')
    cy.contains('ดูทั้งหมด').click()
    cy.url().should('include', '/admin/leaves')
  })

  it('should navigate to employee list via sidebar', () => {
    cy.visit('/admin')
    cy.contains('รายชื่อพนักงาน').click()
    cy.url().should('include', '/admin/employees')
  })

  it('should navigate to add employee via sidebar', () => {
    cy.visit('/admin')
    cy.contains('เพิ่มพนักงาน').click()
    cy.url().should('include', '/admin/employees/new')
  })

  it('should navigate to leave management via sidebar', () => {
    cy.visit('/admin')
    cy.contains('คำขอลาทั้งหมด').click()
    cy.url().should('include', '/admin/leaves')
  })
})
