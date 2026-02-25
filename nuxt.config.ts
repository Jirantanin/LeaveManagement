export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },
  telemetry: false,
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'leave-mgmt-secret-key-2024',
    public: {}
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  }
})
