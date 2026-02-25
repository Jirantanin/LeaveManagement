<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🏢</div>
        <h2 class="text-2xl font-bold text-gray-900">ระบบจัดการพนักงาน</h2>
        <p class="text-gray-500 text-sm mt-1">Employee Management System</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span v-if="loading">กำลังเข้าสู่ระบบ...</span>
          <span v-else>เข้าสู่ระบบ</span>
        </button>
      </form>

      <!-- Demo credentials -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
        <p class="font-semibold text-gray-600 mb-2">Demo Accounts:</p>
        <p>👑 Admin: admin@company.com / admin1234</p>
        <p>👤 พนักงาน: somchai@company.com / emp1234</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    const user = await login(form.email, form.password)
    if (user.role === 'admin') navigateTo('/admin')
    else navigateTo('/employee')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'เข้าสู่ระบบไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>
