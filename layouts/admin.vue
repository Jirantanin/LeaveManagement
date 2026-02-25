<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-white shadow-sm flex flex-col flex-shrink-0">
      <!-- Logo -->
      <div class="p-5 border-b bg-blue-700">
        <h1 class="text-lg font-bold text-white leading-tight">🏢 ระบบจัดการพนักงาน</h1>
        <p class="text-xs text-blue-200 mt-0.5">Admin Panel</p>
      </div>

      <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <!-- ภาพรวม -->
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-3 pb-1">ภาพรวม</p>
        <NuxtLink to="/admin" :class="navClass('/admin', true)">
          <span>📊</span> แดชบอร์ด
        </NuxtLink>

        <!-- จัดการพนักงาน -->
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">จัดการพนักงาน</p>
        <NuxtLink to="/admin/employees" :class="navClass('/admin/employees')">
          <span>👥</span> รายชื่อพนักงาน
        </NuxtLink>
        <NuxtLink to="/admin/employees/new" :class="navClass('/admin/employees/new')">
          <span>➕</span> เพิ่มพนักงาน
        </NuxtLink>

        <!-- วันลา -->
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-4 pb-1">วันลา</p>
        <NuxtLink to="/admin/leaves" :class="navClass('/admin/leaves')">
          <span>📋</span> คำขอลาทั้งหมด
        </NuxtLink>
      </nav>

      <!-- User info -->
      <div class="p-4 border-t">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ user?.name?.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium text-gray-900 truncate">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
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

    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout, loadFromStorage } = useAuth()
const route = useRoute()

onMounted(loadFromStorage)

function navClass(path: string, exact = false) {
  const active = exact ? route.path === path : route.path.startsWith(path) && !(path === '/admin/employees' && route.path === '/admin/employees/new')
  return [
    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
  ]
}
</script>
