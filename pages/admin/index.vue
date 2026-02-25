<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-500 text-sm mt-1">ภาพรวมระบบจัดการวันลา</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">พนักงานทั้งหมด</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalEmployees }}</p>
        <p class="text-xs text-gray-400 mt-1">👥 คน</p>
      </div>
      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <p class="text-xs text-gray-500">คำขอลาทั้งหมด</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalLeaves }}</p>
        <p class="text-xs text-gray-400 mt-1">📋 รายการ</p>
      </div>
      <div class="bg-yellow-50 rounded-xl p-5 shadow-sm border border-yellow-100">
        <p class="text-xs text-yellow-600">รอดำเนินการ</p>
        <p class="text-3xl font-bold text-yellow-600 mt-1">{{ stats.pendingLeaves }}</p>
        <p class="text-xs text-yellow-400 mt-1">⏳ รายการ</p>
      </div>
      <div class="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100">
        <p class="text-xs text-green-600">อนุมัติแล้ว</p>
        <p class="text-3xl font-bold text-green-600 mt-1">{{ stats.approvedLeaves }}</p>
        <p class="text-xs text-green-400 mt-1">✅ รายการ</p>
      </div>
      <div class="bg-red-50 rounded-xl p-5 shadow-sm border border-red-100">
        <p class="text-xs text-red-600">ไม่อนุมัติ</p>
        <p class="text-3xl font-bold text-red-600 mt-1">{{ stats.rejectedLeaves }}</p>
        <p class="text-xs text-red-400 mt-1">❌ รายการ</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent requests -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="font-semibold text-gray-900">คำขอลาล่าสุด</h2>
          <NuxtLink to="/admin/leaves" class="text-xs text-blue-600 hover:underline">ดูทั้งหมด →</NuxtLink>
        </div>
        <div v-if="recentLeaves.length === 0" class="p-8 text-center text-gray-400 text-sm">ยังไม่มีข้อมูล</div>
        <div v-else class="divide-y">
          <div v-for="leave in recentLeaves" :key="leave.id" class="px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                {{ leave.user.name.charAt(0) }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ leave.user.name }}</p>
                <p class="text-xs text-gray-500">{{ leave.leaveType.name }} · {{ leave.days }} วัน · {{ leave.user.department }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <StatusBadge :status="leave.status" />
              <NuxtLink v-if="leave.status === 'pending'" to="/admin/leaves" class="text-xs text-blue-600 hover:underline">จัดการ</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave type distribution -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6 border-b">
          <h2 class="font-semibold text-gray-900">ประเภทการลา</h2>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="item in leaveTypeStats" :key="item.name">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">{{ item.name }}</span>
              <span class="font-medium text-gray-900">{{ item.count }}</span>
            </div>
            <div class="bg-gray-100 rounded-full h-2">
              <div
                class="bg-blue-500 rounded-full h-2 transition-all"
                :style="`width: ${totalLeaves > 0 ? (item.count / totalLeaves) * 100 : 0}%`"
              />
            </div>
          </div>
          <p v-if="leaveTypeStats.length === 0" class="text-gray-400 text-sm text-center py-4">ไม่มีข้อมูล</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { apiFetch, loadFromStorage, user } = useAuth()

const stats = ref({ totalEmployees: 0, totalLeaves: 0, pendingLeaves: 0, approvedLeaves: 0, rejectedLeaves: 0 })
const recentLeaves = ref<any[]>([])
const leaveTypeStats = ref<any[]>([])
const totalLeaves = computed(() => leaveTypeStats.value.reduce((s, i) => s + i.count, 0))

onMounted(async () => {
  loadFromStorage()
  if (!user.value || user.value.role !== 'admin') return navigateTo('/login')
  const data = await apiFetch<any>('/api/admin/dashboard')
  stats.value = data.stats
  recentLeaves.value = data.recentLeaves
  leaveTypeStats.value = data.leaveTypeStats
})
</script>
