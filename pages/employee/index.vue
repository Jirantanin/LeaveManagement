<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">สวัสดี, {{ user?.name }} 👋</h1>
      <p class="text-gray-500 text-sm mt-1">{{ user?.position }} · {{ user?.department }}</p>
    </div>

    <!-- Balance Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="balance in balances"
        :key="balance.leaveTypeId"
        class="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
      >
        <p class="text-xs text-gray-500 mb-1">{{ balance.leaveTypeName }}</p>
        <p class="text-3xl font-bold text-blue-600">{{ balance.remaining }}</p>
        <p class="text-xs text-gray-400 mt-1">เหลือจาก {{ balance.allowed }} วัน</p>
        <div class="mt-3 bg-gray-100 rounded-full h-1.5">
          <div
            class="bg-blue-500 rounded-full h-1.5 transition-all"
            :style="`width: ${Math.max(0, (balance.remaining / balance.allowed) * 100)}%`"
          />
        </div>
      </div>
    </div>

    <!-- Recent Leaves + Quick Action -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="font-semibold text-gray-900">คำขอลาล่าสุด</h2>
          <NuxtLink to="/employee/leaves" class="text-xs text-blue-600 hover:underline">ดูทั้งหมด</NuxtLink>
        </div>
        <div v-if="recentLeaves.length === 0" class="p-8 text-center text-gray-400 text-sm">
          ยังไม่มีประวัติการลา
        </div>
        <div v-else class="divide-y">
          <div v-for="leave in recentLeaves" :key="leave.id" class="px-6 py-4 flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-900">{{ leave.leaveType.name }}</p>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ formatDate(leave.startDate) }}
                <span v-if="leave.startDate !== leave.endDate"> – {{ formatDate(leave.endDate) }}</span>
                · {{ leave.days }} วัน
              </p>
            </div>
            <StatusBadge :status="leave.status" />
          </div>
        </div>
      </div>

      <!-- Quick action -->
      <div class="bg-blue-600 rounded-xl shadow-sm p-6 text-white flex flex-col justify-between">
        <div>
          <p class="text-blue-100 text-sm font-medium">ต้องการลาหยุด?</p>
          <h3 class="text-xl font-bold mt-2">ยื่นคำขอลา<br/>ได้เลย</h3>
          <p class="text-blue-100 text-sm mt-3">รวดเร็ว ง่าย ไม่ต้องใช้กระดาษ</p>
        </div>
        <NuxtLink
          to="/employee/leaves/new"
          class="mt-6 bg-white text-blue-600 font-semibold py-2.5 rounded-lg text-center text-sm hover:bg-blue-50 transition-colors"
        >
          ยื่นคำขอลา →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { user, apiFetch, loadFromStorage } = useAuth()

const balances = ref<any[]>([])
const recentLeaves = ref<any[]>([])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  loadFromStorage()
  if (!user.value) return navigateTo('/login')
  try {
    const data = await apiFetch<any>('/api/leaves?limit=5')
    balances.value = data.balances
    recentLeaves.value = data.leaves
  } catch { navigateTo('/login') }
})
</script>
