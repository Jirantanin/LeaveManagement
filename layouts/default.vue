<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-sm flex flex-col">
      <div class="p-6 border-b">
        <h1 class="text-lg font-bold text-blue-600 leading-tight">🏢 ระบบจัดการพนักงาน</h1>
        <p class="text-xs text-gray-500 mt-0.5">Employee Portal</p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          to="/employee"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/employee' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          <span>📊</span> แดชบอร์ด
        </NuxtLink>
        <NuxtLink
          to="/employee/leaves/new"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/employee/leaves/new' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          <span>📝</span> ยื่นคำขอลา
        </NuxtLink>
        <NuxtLink
          to="/employee/leaves"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="$route.path === '/employee/leaves' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          <span>📋</span> ประวัติการลา
        </NuxtLink>
      </nav>
      <div class="p-4 border-t">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            {{ user?.name?.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user?.department }}</p>
          </div>
        </div>
        <button
          @click="logout"
          class="w-full text-left text-sm text-red-500 hover:text-red-700 flex items-center gap-2 px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
        >
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout, loadFromStorage } = useAuth()
onMounted(loadFromStorage)
</script>
