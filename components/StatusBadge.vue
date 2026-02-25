<template>
  <span :class="styles[status] || styles.pending" class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full">
    {{ labels[status] || status }}
  </span>
</template>

<script setup lang="ts">
defineProps<{ status: string }>()

const styles: Record<string, string> = {
  pending:  'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200'
}
const labels: Record<string, string> = {
  pending:  '⏳ รอดำเนินการ',
  approved: '✅ อนุมัติแล้ว',
  rejected: '❌ ไม่อนุมัติ'
}
</script>
