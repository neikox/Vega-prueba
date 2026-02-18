<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'BaseBadge'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap'
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }
  
  return [base, variants[props.variant]]
})
</script>
