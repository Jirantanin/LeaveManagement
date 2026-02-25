describe('Authentication', () => {
  beforeEach(() => {
    cy.logout()
  })

  it('should redirect to /login when not authenticated', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('should redirect to /admin after admin login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(Cypress.env('adminEmail'))
    cy.get('input[type="password"]').type(Cypress.env('adminPassword'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin')
  })

  it('should redirect to /employee after employee login', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(Cypress.env('employeeEmail'))
    cy.get('input[type="password"]').type(Cypress.env('employeePassword'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/employee')
  })

  it('should show error message with invalid credentials', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('wrong@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.contains('อีเมลหรือรหัสผ่านไม่ถูกต้อง').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('should logout and redirect to /login', () => {
    cy.loginAsAdmin()
    cy.visit('/admin')
    cy.contains('ออกจากระบบ').click()
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('auth_token')).to.be.null
    })
  })
})
