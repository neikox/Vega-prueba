<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <slot v-else />
  </button>
</template>

<script>
export default {
  name: 'BaseButton'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold border-0 rounded-lg cursor-pointer transition-all duration-150 font-sans disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  const variants = {
    primary: 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:hover:transform-none disabled:hover:shadow-none',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
  }
  
  return [base, sizes[props.size], variants[props.variant]]
})
</script>
