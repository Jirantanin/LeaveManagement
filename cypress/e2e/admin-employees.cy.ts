describe('Admin Employee Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
  })

  it('should load employee list with employee count', () => {
    cy.visit('/admin/employees')
    cy.contains('พนักงานทั้งหมด').should('be.visible')
    // มีพนักงานอย่างน้อย 1 คน (จาก seed)
    cy.get('table tbody tr').should('have.length.at.least', 1)
  })

  it('should search employee by name', () => {
    cy.visit('/admin/employees')
    cy.get('input[placeholder*="ค้นหา"]').type('สมชาย')
    // filter ทำงาน — เห็นเฉพาะที่ match
    cy.contains('สมชาย').should('be.visible')
  })

  it('should filter employees by department', () => {
    cy.visit('/admin/employees')
    cy.get('select').first().select('IT')
    cy.get('body').then(($body) => {
      if ($body.find('table tbody tr').length > 0) {
        cy.get('table tbody tr').each(($row) => {
          cy.wrap($row).contains('IT')
        })
      } else {
        cy.log('ไม่มีพนักงานในแผนก IT')
      }
    })
  })

  it('should navigate to employee detail page', () => {
    cy.visit('/admin/employees')
    cy.contains('ดูข้อมูล').first().click()
    cy.url().should('match', /\/admin\/employees\/\d+/)
  })

  it('should show employee detail with edit button', () => {
    cy.visit('/admin/employees')
    cy.contains('ดูข้อมูล').first().click()
    cy.contains('แก้ไขข้อมูล').should('be.visible')
  })

  it('should enter edit mode when clicking แก้ไขข้อมูล', () => {
    cy.visit('/admin/employees')
    cy.contains('ดูข้อมูล').first().click()
    cy.contains('แก้ไขข้อมูล').click()
    // ปุ่ม บันทึก และ ยกเลิก ควรปรากฏ
    cy.contains('บันทึก').should('be.visible')
    cy.contains('ยกเลิก').should('be.visible')
  })

  it('should cancel edit mode', () => {
    cy.visit('/admin/employees')
    cy.contains('ดูข้อมูล').first().click()
    cy.contains('แก้ไขข้อมูล').click()
    cy.contains('ยกเลิก').click()
    // กลับมา view mode
    cy.contains('แก้ไขข้อมูล').should('be.visible')
  })

  it('should navigate to add new employee page', () => {
    cy.visit('/admin/employees')
    cy.contains('เพิ่มพนักงาน').click()
    cy.url().should('include', '/admin/employees/new')
    cy.contains('เพิ่มพนักงานใหม่').should('be.visible')
  })

  it('should add a new employee successfully', () => {
    cy.visit('/admin/employees/new')

    // Section 1: บัญชี
    cy.get('input[placeholder*="รหัสพนักงาน"]').type('EMP999')
    cy.get('input[placeholder*="ชื่อ-นามสกุล"]').type('ทดสอบ ไซเปรส')
    cy.get('input[type="email"]').type('cypress.test@company.com')
    cy.get('input[type="password"]').type('test1234')

    // Section 2: ตำแหน่ง — เลือก department ก่อน แล้ว position
    cy.get('select').eq(0).select('IT')
    cy.get('select').eq(1).should('not.be.disabled').select(1)

    // กด บันทึก
    cy.contains('button', 'บันทึก').click()

    // redirect ไปหน้า detail
    cy.url().should('match', /\/admin\/employees\/\d+/)
    cy.contains('ทดสอบ ไซเปรส').should('be.visible')
  })
})
