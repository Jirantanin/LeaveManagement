<template>
  <div class="p-8 max-w-2xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">ยื่นคำขอลา</h1>
      <p class="text-gray-500 text-sm mt-1">กรอกข้อมูลให้ครบถ้วน</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <form @submit.prevent="submit" class="space-y-5">
        <!-- Leave Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">ประเภทการลา <span class="text-red-500">*</span></label>
          <select
            v-model="form.leaveTypeId"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">-- เลือกประเภทการลา --</option>
            <option v-for="lt in leaveTypes" :key="lt.id" :value="lt.id">
              {{ lt.name }} (สิทธิ์ {{ lt.daysAllowed }} วัน/ปี)
            </option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">วันที่เริ่มลา <span class="text-red-500">*</span></label>
            <input
              v-model="form.startDate"
              type="date"
              required
              :min="today"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">วันที่สิ้นสุด <span class="text-red-500">*</span></label>
            <input
              v-model="form.endDate"
              type="date"
              required
              :min="form.startDate || today"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <!-- Days preview -->
        <div v-if="calculatedDays > 0" class="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-700">
          📅 จำนวนวันที่ลา: <strong>{{ calculatedDays }} วัน</strong>
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">เหตุผลการลา <span class="text-red-500">*</span></label>
          <textarea
            v-model="form.reason"
            required
            rows="3"
            placeholder="ระบุเหตุผลการลา..."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {{ error }}
        </p>

        <!-- Success -->
        <div v-if="success" class="text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-2">
          <span>✅</span> ยื่นคำขอลาเรียบร้อยแล้ว รอผู้บริหารอนุมัติ
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {{ loading ? 'กำลังส่ง...' : 'ยื่นคำขอลา' }}
          </button>
          <NuxtLink
            to="/employee"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center"
          >
            ยกเลิก
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { apiFetch, loadFromStorage, user } = useAuth()

const leaveTypes = ref<any[]>([])
const form = reactive({ leaveTypeId: '', startDate: '', endDate: '', reason: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const today = new Date().toISOString().split('T')[0]

const calculatedDays = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  const diff = new Date(form.endDate).getTime() - new Date(form.startDate).getTime()
  if (diff < 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
})

async function submit() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    await apiFetch('/api/leaves', {
      method: 'POST',
      body: form
    })
    success.value = true
    Object.assign(form, { leaveTypeId: '', startDate: '', endDate: '', reason: '' })
    setTimeout(() => navigateTo('/employee/leaves'), 1500)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'เกิดข้อผิดพลาด'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value) return navigateTo('/login')
  leaveTypes.value = await apiFetch('/api/leave-types')
})
</script>
