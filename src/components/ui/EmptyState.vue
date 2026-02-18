<template>
  <div class="flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
    <div class="mb-6 opacity-50">
      <slot name="icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="40" rx="4" stroke="#d1d5db" stroke-width="2"/>
          <line x1="8" y1="24" x2="56" y2="24" stroke="#d1d5db" stroke-width="2"/>
          <circle cx="32" cy="38" r="8" stroke="#d1d5db" stroke-width="2"/>
          <line x1="38" y1="44" x2="44" y2="50" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </slot>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-900 mb-2">
      <slot name="title">No hay datos disponibles</slot>
    </h3>
    
    <p class="text-sm text-gray-600 mb-8 max-w-md leading-relaxed">
      <slot name="description">
        No se encontraron resultados. Intenta ajustar los filtros o crear un nuevo elemento.
      </slot>
    </p>
    
    <div v-if="$slots.action" class="flex gap-3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
// Empty state component for no data scenarios
</script>
