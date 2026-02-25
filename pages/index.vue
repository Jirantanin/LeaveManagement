<script setup lang="ts">
const { user, loadFromStorage } = useAuth()
onMounted(() => {
  loadFromStorage()
  if (user.value?.role === 'admin') navigateTo('/admin')
  else if (user.value?.role === 'employee') navigateTo('/employee')
  else navigateTo('/login')
})
</script>
<template><div></div></template>
