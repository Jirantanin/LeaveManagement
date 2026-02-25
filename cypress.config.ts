import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    env: {
      adminEmail: 'admin@company.com',
      adminPassword: 'admin1234',
      employeeEmail: 'somchai@company.com',
      employeePassword: 'emp1234',
    },
  },
})
