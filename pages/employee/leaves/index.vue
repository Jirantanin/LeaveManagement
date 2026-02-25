<template>
  <div class="p-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">ประวัติการลา</h1>
        <p class="text-gray-500 text-sm mt-1">รายการคำขอลาทั้งหมดของคุณ</p>
      </div>
      <NuxtLink
        to="/employee/leaves/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        + ยื่นคำขอใหม่
      </NuxtLink>
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
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="filteredLeaves.length === 0" class="p-12 text-center text-gray-400">
        <p class="text-4xl mb-3">📭</p>
        <p class="text-sm">ไม่มีรายการ</p>
      </div>
      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวน</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">เหตุผล</th>
            <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="leave in filteredLeaves" :key="leave.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ leave.leaveType.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ formatDate(leave.startDate) }}
              <span v-if="leave.startDate !== leave.endDate"><br/>{{ formatDate(leave.endDate) }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ leave.days }} วัน</td>
            <td class="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{{ leave.reason }}</td>
            <td class="px-6 py-4"><StatusBadge :status="leave.status" /></td>
            <td class="px-6 py-4">
              <button
                v-if="leave.status === 'pending'"
                @click="cancelLeave(leave.id)"
                class="text-xs text-red-500 hover:text-red-700 hover:underline"
              >ยกเลิก</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function cancelLeave(id: number) {
  if (!confirm('ต้องการยกเลิกคำขอนี้?')) return
  try {
    await apiFetch(`/api/leaves/${id}`, { method: 'DELETE' })
    leaves.value = leaves.value.filter(l => l.id !== id)
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'เกิดข้อผิดพลาด')
  }
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value) return navigateTo('/login')
  const data = await apiFetch<any>('/api/leaves')
  leaves.value = data.leaves
})
</script>
