// Custom Cypress Commands

// Login ผ่าน API โดยตรง (เร็วกว่า fill form ใน UI)
Cypress.Commands.add('loginAsAdmin', () => {
  cy.request('POST', '/api/auth/login', {
    email: Cypress.env('adminEmail'),
    password: Cypress.env('adminPassword'),
  }).then((response) => {
    window.localStorage.setItem('auth_token', response.body.token)
    window.localStorage.setItem('auth_user', JSON.stringify(response.body.user))
  })
})

Cypress.Commands.add('loginAsEmployee', () => {
  cy.request('POST', '/api/auth/login', {
    email: Cypress.env('employeeEmail'),
    password: Cypress.env('employeePassword'),
  }).then((response) => {
    window.localStorage.setItem('auth_token', response.body.token)
    window.localStorage.setItem('auth_user', JSON.stringify(response.body.user))
  })
})

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('auth_token')
  window.localStorage.removeItem('auth_user')
})

// TypeScript declarations
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>
      loginAsEmployee(): Chainable<void>
      logout(): Chainable<void>
    }
  }
}
