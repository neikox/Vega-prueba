<template>
  <div class="flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
    <div class="mb-6">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke="#ef4444" stroke-width="2"/>
        <path d="M32 20v16m0 4v2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>
    
    <p class="text-sm text-gray-600 mb-8 max-w-md leading-relaxed">
      {{ description }}
    </p>
    
    <BaseButton 
      variant="secondary" 
      @click="$emit('retry')"
      :loading="loading"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.417A6 6 0 118 2v1z"/>
        <path d="M8 4.466V.534a.25.25 0 01.416-.192l2.36 1.966c.12.1.12.284 0 .384L8.416 4.658A.25.25 0 018 4.466z"/>
      </svg>
      Reintentar
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Error al cargar los datos'
  },
  description: {
    type: String,
    default: 'Ha ocurrido un error al intentar cargar la información. Por favor, intenta de nuevo.'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>
