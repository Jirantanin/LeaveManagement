<template>
  <div :class="classSpan">
    <label class="block text-xs font-medium text-gray-500 mb-1">{{ label }}</label>
    <template v-if="editing">
      <input
        v-if="!textarea"
        :type="type || 'text'"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :required="required"
        :placeholder="placeholder"
        class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <textarea
        v-else
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        rows="2"
        class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      />
    </template>
    <p v-else class="text-sm text-gray-900">{{ value || '—' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value?: string | null
  modelValue?: string
  editing: boolean
  type?: string
  required?: boolean
  placeholder?: string
  textarea?: boolean
  classSpan?: string
}>()
defineEmits(['update:modelValue'])
</script>
