<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">คำขอลาทั้งหมด</h1>
      <p class="text-gray-500 text-sm mt-1">อนุมัติหรือปฏิเสธคำขอลาของพนักงาน</p>
    </div>

    <!-- Filter -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="activeFilter = f.value"
        :class="activeFilter === f.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'"
        class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
      >
        {{ f.label }}
        <span v-if="f.value !== 'all'" class="ml-1 text-xs opacity-75">({{ countByStatus(f.value) }})</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="filteredLeaves.length === 0" class="p-12 text-center text-gray-400">
        <p class="text-4xl mb-3">📭</p>
        <p class="text-sm">ไม่มีคำขอ</p>
      </div>
      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">พนักงาน</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ประเภท</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">วันที่</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">วัน</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">เหตุผล</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">สถานะ</th>
            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="leave in filteredLeaves" :key="leave.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <p class="text-sm font-medium text-gray-900">{{ leave.user.name }}</p>
              <p class="text-xs text-gray-500">{{ leave.user.department }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ leave.leaveType.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(leave.startDate) }}<br/>
              <span v-if="leave.days > 1">{{ formatDate(leave.endDate) }}</span>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ leave.days }}</td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-[160px] truncate">{{ leave.reason }}</td>
            <td class="px-6 py-4"><StatusBadge :status="leave.status" /></td>
            <td class="px-6 py-4">
              <div v-if="leave.status === 'pending'" class="flex gap-2">
                <button
                  @click="updateLeave(leave.id, 'approved')"
                  class="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full transition-colors font-medium"
                >อนุมัติ</button>
                <button
                  @click="updateLeave(leave.id, 'rejected')"
                  class="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full transition-colors font-medium"
                >ปฏิเสธ</button>
              </div>
              <span v-else class="text-xs text-gray-400">–</span>
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

const leaves = ref<any[]>([])
const activeFilter = ref('all')

const filters = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'รอดำเนินการ', value: 'pending' },
  { label: 'อนุมัติแล้ว', value: 'approved' },
  { label: 'ไม่อนุมัติ', value: 'rejected' }
]

const filteredLeaves = computed(() =>
  activeFilter.value === 'all' ? leaves.value : leaves.value.filter(l => l.status === activeFilter.value)
)

function countByStatus(status: string) {
  return leaves.value.filter(l => l.status === status).length
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function updateLeave(id: number, status: string) {
  try {
    await apiFetch(`/api/admin/leaves/${id}`, { method: 'PATCH', body: { status } })
    const idx = leaves.value.findIndex(l => l.id === id)
    if (idx !== -1) leaves.value[idx].status = status
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'เกิดข้อผิดพลาด')
  }
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value || user.value.role !== 'admin') return navigateTo('/login')
  leaves.value = await apiFetch<any[]>('/api/admin/leaves')
})
</script>
