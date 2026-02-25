<template>
  <div class="p-8 max-w-4xl">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <NuxtLink to="/admin/employees" class="hover:text-blue-600">พนักงาน</NuxtLink>
      <span>/</span>
      <span class="text-gray-900">{{ emp?.name || '...' }}</span>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-64 text-gray-400">
      <p>กำลังโหลด...</p>
    </div>

    <template v-else-if="emp">
      <!-- Profile header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
            {{ emp.name.charAt(0) }}
          </div>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold text-gray-900">{{ emp.name }}</h1>
              <span v-if="emp.employeeId" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">{{ emp.employeeId }}</span>
              <span :class="emp.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'"
                class="text-xs border px-2 py-0.5 rounded-full font-medium">
                {{ emp.isActive ? 'ทำงานอยู่' : 'ไม่ได้ทำงาน' }}
              </span>
            </div>
            <p class="text-gray-500 text-sm mt-0.5">{{ emp.position }} · {{ emp.department }}</p>
            <p class="text-gray-400 text-xs mt-0.5">{{ emp.email }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            v-if="!editing"
            @click="editing = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >✏️ แก้ไขข้อมูล</button>
          <template v-else>
            <button @click="save" :disabled="saving"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
              {{ saving ? 'กำลังบันทึก...' : '💾 บันทึก' }}
            </button>
            <button @click="cancelEdit"
              class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              ยกเลิก
            </button>
          </template>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left - Info form -->
        <div class="lg:col-span-2 space-y-5">

          <!-- ข้อมูลบัญชี -->
          <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>🔑</span> ข้อมูลบัญชี</h2>
            <div class="grid grid-cols-2 gap-4">
              <InfoField label="รหัสพนักงาน" :value="emp.employeeId" v-model="form.employeeId" :editing="editing" placeholder="EMP001" />
              <InfoField label="ชื่อ-สกุล" :value="emp.name" v-model="form.name" :editing="editing" required />
              <InfoField label="อีเมล" :value="emp.email" v-model="form.email" :editing="editing" type="email" class-span="col-span-2" />
            </div>
          </section>

          <!-- ตำแหน่ง -->
          <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>🏢</span> ตำแหน่งและแผนก</h2>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="editing">
                <label class="label">แผนก</label>
                <select v-model="form.department" class="input" @change="form.position = ''">
                  <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <InfoField v-else label="แผนก" :value="emp.department" v-model="form.department" :editing="false" />

              <div v-if="editing">
                <label class="label">ตำแหน่ง</label>
                <select v-if="positionOptions.length" v-model="form.position" class="input">
                  <option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</option>
                </select>
                <input v-else v-model="form.position" type="text" class="input" />
              </div>
              <InfoField v-else label="ตำแหน่ง" :value="emp.position" v-model="form.position" :editing="false" />

              <div v-if="editing">
                <label class="label">วันที่เริ่มงาน</label>
                <input v-model="form.hireDate" type="date" class="input" />
              </div>
              <InfoField v-else label="วันที่เริ่มงาน" :value="formatDate(emp.hireDate)" v-model="form.hireDate" :editing="false" />
            </div>
          </section>

          <!-- ข้อมูลส่วนตัว -->
          <section class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> ข้อมูลส่วนตัว</h2>
            <div class="grid grid-cols-2 gap-4">
              <div v-if="editing">
                <label class="label">เพศ</label>
                <select v-model="form.gender" class="input">
                  <option value="">ไม่ระบุ</option>
                  <option v-for="g in genders" :key="g.value" :value="g.value">{{ g.label }}</option>
                </select>
              </div>
              <InfoField v-else label="เพศ" :value="genderLabel(emp.gender)" v-model="form.gender" :editing="false" />

              <div v-if="editing">
                <label class="label">วันเกิด</label>
                <input v-model="form.birthDate" type="date" class="input" />
              </div>
              <InfoField v-else label="วันเกิด" :value="formatDate(emp.birthDate)" v-model="form.birthDate" :editing="false" />

              <InfoField label="เบอร์โทร" :value="emp.phone" v-model="form.phone" :editing="editing" type="tel" placeholder="08X-XXX-XXXX" />

              <div :class="editing ? '' : 'col-span-2'">
                <label class="label">ที่อยู่</label>
                <textarea v-if="editing" v-model="form.address" rows="2" class="input resize-none w-full" />
                <p v-else class="text-sm text-gray-900">{{ emp.address || '—' }}</p>
              </div>
            </div>
          </section>

          <!-- สถานะ -->
          <section v-if="editing" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="font-semibold text-gray-900 mb-4 flex items-center gap-2"><span>⚙️</span> สถานะพนักงาน</h2>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="form.isActive" class="w-4 h-4 text-blue-600 rounded" />
              <span class="text-sm text-gray-700">ยังทำงานอยู่</span>
            </label>
          </section>

          <p v-if="saveError" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{ saveError }}</p>
        </div>

        <!-- Right - Stats & leave history -->
        <div class="space-y-5">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <p class="text-xs text-gray-500">คำขอลาทั้งหมด</p>
            <p class="text-3xl font-bold text-blue-600 mt-1">{{ emp._count.leaveRequests }}</p>
            <p class="text-xs text-gray-400 mt-1">รายการ</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 class="font-semibold text-gray-900 mb-3 text-sm">ประวัติลาล่าสุด</h3>
            <div v-if="emp.leaveRequests.length === 0" class="text-gray-400 text-xs text-center py-4">ไม่มีประวัติ</div>
            <div v-else class="space-y-3">
              <div v-for="lr in emp.leaveRequests" :key="lr.id" class="text-xs">
                <div class="flex justify-between items-start">
                  <span class="text-gray-700 font-medium">{{ lr.leaveType.name }}</span>
                  <StatusBadge :status="lr.status" />
                </div>
                <p class="text-gray-400 mt-0.5">{{ formatDate(lr.startDate) }} · {{ lr.days }} วัน</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { apiFetch, loadFromStorage, user } = useAuth()
const route = useRoute()
const { departments, genders, POSITIONS } = await import('~/composables/useEmployeeOptions')

const emp = ref<any>(null)
const loading = ref(true)
const editing = ref(false)
const saving = ref(false)
const saveError = ref('')

const form = reactive({
  employeeId: '', name: '', email: '', department: '', position: '',
  gender: '', phone: '', birthDate: '', hireDate: '', address: '', isActive: true
})

const positionOptions = computed(() => POSITIONS[form.department] || [])

function genderLabel(g: string | null) {
  return { male: 'ชาย', female: 'หญิง', other: 'ไม่ระบุ' }[g || ''] || '—'
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
}

function toDateInput(d: string | null) {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

function fillForm(data: any) {
  form.employeeId = data.employeeId || ''
  form.name = data.name
  form.email = data.email
  form.department = data.department
  form.position = data.position
  form.gender = data.gender || ''
  form.phone = data.phone || ''
  form.birthDate = toDateInput(data.birthDate)
  form.hireDate = toDateInput(data.hireDate)
  form.address = data.address || ''
  form.isActive = data.isActive
}

function cancelEdit() {
  fillForm(emp.value)
  editing.value = false
  saveError.value = ''
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    const updated = await apiFetch(`/api/admin/employees/${emp.value.id}`, {
      method: 'PATCH',
      body: form
    })
    emp.value = { ...emp.value, ...updated }
    editing.value = false
  } catch (e: any) {
    saveError.value = e?.data?.statusMessage || 'เกิดข้อผิดพลาด'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value || user.value.role !== 'admin') return navigateTo('/login')
  try {
    emp.value = await apiFetch(`/api/admin/employees/${route.params.id}`)
    fillForm(emp.value)
  } catch { navigateTo('/admin/employees') }
  finally { loading.value = false }
})
</script>

<style scoped>
.label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.input { @apply w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm; }
</style>
