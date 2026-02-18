<template>
  <div :class="skeletonClasses" :style="customStyle"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'circle', 'card', 'button'].includes(value)
  },
  width: {
    type: String,
    default: null
  },
  height: {
    type: String,
    default: null
  }
})

const skeletonClasses = computed(() => {
  const base = 'animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]'
  
  const types = {
    text: 'h-4 w-full rounded',
    circle: 'w-12 h-12 rounded-full',
    card: 'w-full h-40 rounded-xl',
    button: 'w-32 h-10 rounded-lg'
  }
  
  return [base, types[props.type]]
})

const customStyle = computed(() => ({
  ...(props.width && { width: props.width }),
  ...(props.height && { height: props.height })
}))
</script>

<style scoped>
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-pulse {
  animation: shimmer 1.5s ease-in-out infinite;
}
</style>
