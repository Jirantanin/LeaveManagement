<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-6 flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">รายชื่อพนักงาน</h1>
        <p class="text-gray-500 text-sm mt-1">พนักงานทั้งหมด {{ filtered.length }} คน</p>
      </div>
      <NuxtLink
        to="/admin/employees/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <span>➕</span> เพิ่มพนักงาน
      </NuxtLink>
    </div>

    <!-- Search & Filter bar -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
      <div class="relative flex-1 min-w-[200px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          v-model="search"
          type="text"
          placeholder="ค้นหาชื่อ, อีเมล, รหัสพนักงาน..."
          class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select v-model="filterDept" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">ทุกแผนก</option>
        <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
      </select>
      <select v-model="filterStatus" class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">ทุกสถานะ</option>
        <option value="active">ทำงานอยู่</option>
        <option value="inactive">ไม่ได้ทำงาน</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="filtered.length === 0" class="p-12 text-center text-gray-400">
        <p class="text-4xl mb-3">👥</p>
        <p class="text-sm">ไม่พบพนักงานที่ค้นหา</p>
      </div>
      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">แผนก / ตำแหน่ง</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">เบอร์โทร</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">วันเริ่มงาน</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">คำขอลา</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="emp in filtered"
            :key="emp.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="navigateTo(`/admin/employees/${emp.id}`)"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {{ emp.name.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ emp.name }}</p>
                  <p class="text-xs text-gray-500">{{ emp.email }}</p>
                  <p v-if="emp.employeeId" class="text-xs text-gray-400 font-mono">{{ emp.employeeId }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-gray-900">{{ emp.department }}</p>
              <p class="text-xs text-gray-500">{{ emp.position }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ emp.phone || '—' }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(emp.hireDate) }}</td>
            <td class="px-6 py-4">
              <span
                :class="emp.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'"
                class="text-xs border px-2.5 py-1 rounded-full font-medium"
              >{{ emp.isActive ? '● ทำงานอยู่' : '○ ไม่ได้ทำงาน' }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {{ emp._count.leaveRequests }}
              </span>
            </td>
            <td class="px-6 py-4">
              <NuxtLink
                :to="`/admin/employees/${emp.id}`"
                class="text-xs text-blue-600 hover:underline font-medium"
                @click.stop
              >ดูข้อมูล →</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { apiFetch, loadFromStorage, user } = useAuth()
const { departments } = await import('~/composables/useEmployeeOptions')

const employees = ref<any[]>([])
const search = ref('')
const filterDept = ref('')
const filterStatus = ref('')

const filtered = computed(() => {
  let list = employees.value
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.employeeId || '').toLowerCase().includes(q)
    )
  }
  if (filterDept.value) list = list.filter(e => e.department === filterDept.value)
  if (filterStatus.value === 'active') list = list.filter(e => e.isActive)
  if (filterStatus.value === 'inactive') list = list.filter(e => !e.isActive)
  return list
})

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value || user.value.role !== 'admin') return navigateTo('/login')
  employees.value = await apiFetch<any[]>('/api/admin/employees')
})
</script>
