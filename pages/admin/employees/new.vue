<template>
  <div class="p-8 max-w-3xl">
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <NuxtLink to="/admin/employees" class="hover:text-blue-600">พนักงาน</NuxtLink>
        <span>/</span>
        <span class="text-gray-900">เพิ่มพนักงานใหม่</span>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">เพิ่มพนักงานใหม่</h1>
      <p class="text-gray-500 text-sm mt-1">กรอกข้อมูลพนักงานให้ครบถ้วน</p>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <!-- ข้อมูลบัญชี -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <span class="text-lg">🔑</span> ข้อมูลบัญชี
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">รหัสพนักงาน</label>
            <input v-model="form.employeeId" type="text" placeholder="เช่น EMP001" class="input" />
            <p class="hint">ถ้าไม่กรอก ระบบจะไม่กำหนดรหัส</p>
          </div>
          <div>
            <label class="label">ชื่อ-สกุล <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" required placeholder="ชื่อ นามสกุล" class="input" />
          </div>
          <div>
            <label class="label">อีเมล <span class="text-red-500">*</span></label>
            <input v-model="form.email" type="email" required placeholder="email@company.com" class="input" />
          </div>
          <div>
            <label class="label">รหัสผ่าน <span class="text-red-500">*</span></label>
            <input v-model="form.password" type="password" required placeholder="อย่างน้อย 6 ตัวอักษร" minlength="6" class="input" />
          </div>
        </div>
      </section>

      <!-- ข้อมูลตำแหน่ง -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <span class="text-lg">🏢</span> ตำแหน่งและแผนก
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">แผนก <span class="text-red-500">*</span></label>
            <select v-model="form.department" required class="input" @change="form.position = ''">
              <option value="">-- เลือกแผนก --</option>
              <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="label">ตำแหน่ง <span class="text-red-500">*</span></label>
            <select v-if="positionOptions.length" v-model="form.position" required class="input">
              <option value="">-- เลือกตำแหน่ง --</option>
              <option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</option>
            </select>
            <input v-else v-model="form.position" type="text" required placeholder="ระบุตำแหน่ง" class="input" />
          </div>
          <div>
            <label class="label">วันที่เริ่มงาน</label>
            <input v-model="form.hireDate" type="date" class="input" />
          </div>
        </div>
      </section>

      <!-- ข้อมูลส่วนตัว -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <span class="text-lg">👤</span> ข้อมูลส่วนตัว
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">เพศ</label>
            <select v-model="form.gender" class="input">
              <option value="">-- ไม่ระบุ --</option>
              <option v-for="g in genders" :key="g.value" :value="g.value">{{ g.label }}</option>
            </select>
          </div>
          <div>
            <label class="label">วันเกิด</label>
            <input v-model="form.birthDate" type="date" class="input" />
          </div>
          <div>
            <label class="label">เบอร์โทรศัพท์</label>
            <input v-model="form.phone" type="tel" placeholder="08X-XXX-XXXX" class="input" />
          </div>
          <div class="sm:col-span-2">
            <label class="label">ที่อยู่</label>
            <textarea v-model="form.address" rows="2" placeholder="ที่อยู่" class="input resize-none" />
          </div>
        </div>
      </section>

      <!-- Error / Actions -->
      <p v-if="error" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{ error }}</p>

      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          {{ loading ? 'กำลังบันทึก...' : '💾 บันทึกข้อมูล' }}
        </button>
        <NuxtLink
          to="/admin/employees"
          class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          ยกเลิก
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { apiFetch, loadFromStorage, user } = useAuth()
const { departments, genders, POSITIONS } = await import('~/composables/useEmployeeOptions')

const form = reactive({
  employeeId: '', name: '', email: '', password: '',
  department: '', position: '',
  gender: '', phone: '', birthDate: '', hireDate: '', address: ''
})

const positionOptions = computed(() => POSITIONS[form.department] || [])

const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const emp = await apiFetch('/api/admin/employees', {
      method: 'POST',
      body: form
    })
    navigateTo(`/admin/employees/${emp.id}`)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'เกิดข้อผิดพลาด'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFromStorage()
  if (!user.value || user.value.role !== 'admin') navigateTo('/login')
})
</script>

<style scoped>
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.input { @apply w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm; }
.hint  { @apply text-xs text-gray-400 mt-1; }
</style>
