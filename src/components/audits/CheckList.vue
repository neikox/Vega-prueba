<template>
  <div class="space-y-6">
    <!-- Estadísticas de checks -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-gray-900">{{ stats.total }}</div>
        <div class="text-xs text-gray-600 uppercase tracking-wider mt-1">Total</div>
      </div>
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-blue-700">{{ stats.pending }}</div>
        <div class="text-xs text-blue-600 uppercase tracking-wider mt-1">Pendientes</div>
      </div>
      <div class="bg-indigo-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-indigo-700">{{ stats.running }}</div>
        <div class="text-xs text-indigo-600 uppercase tracking-wider mt-1">En ejecución</div>
      </div>
      <div class="bg-emerald-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-emerald-700">{{ stats.ok }}</div>
        <div class="text-xs text-emerald-600 uppercase tracking-wider mt-1">Exitosos</div>
      </div>
      <div class="bg-red-50 rounded-lg p-4">
        <div class="text-2xl font-bold text-red-700">{{ stats.ko }}</div>
        <div class="text-xs text-red-600 uppercase tracking-wider mt-1">Fallidos</div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="activeFilter = filter.value"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          activeFilter === filter.value
            ? 'bg-indigo-600 text-white'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
        ]"
      >
        {{ filter.label }}
        <span v-if="filter.count > 0" class="ml-2"> ({{ filter.count }}) </span>
      </button>
    </div>

    <!-- Lista de checks -->
    <div v-if="filteredChecks.length > 0" class="space-y-3">
      <CheckItem
        v-for="check in filteredChecks"
        :key="check.id"
        :check="check"
        @execute="$emit('execute', $event)"
        @mark-ok="$emit('mark-ok', $event)"
        @mark-ko="$emit('mark-ko', $event)"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-gray-500">
        No hay checks {{ activeFilter !== 'all' ? 'con este filtro' : 'disponibles' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CheckItem from './CheckItem.vue'

const props = defineProps({
  checks: {
    type: Array,
    default: () => [],
  },
})

const activeFilter = ref('all')

// Estadísticas
const stats = computed(() => ({
  total: props.checks.length,
  pending: props.checks.filter((c) => c.status === 'PENDING').length,
  running: props.checks.filter((c) => ['QUEUED', 'RUNNING'].includes(c.status)).length,
  ok: props.checks.filter((c) => c.status === 'OK').length,
  ko: props.checks.filter((c) => c.status === 'KO').length,
}))

// Filtros disponibles
const filters = computed(() => [
  { label: 'Todos', value: 'all', count: stats.value.total },
  { label: 'Pendientes', value: 'PENDING', count: stats.value.pending },
  { label: 'En ejecución', value: 'RUNNING', count: stats.value.running },
  { label: 'Exitosos', value: 'OK', count: stats.value.ok },
  { label: 'Fallidos', value: 'KO', count: stats.value.ko },
])

// Checks filtrados
const filteredChecks = computed(() => {
  if (activeFilter.value === 'all') {
    return props.checks
  }

  if (activeFilter.value === 'RUNNING') {
    return props.checks.filter((c) => ['QUEUED', 'RUNNING'].includes(c.status))
  }

  return props.checks.filter((c) => c.status === activeFilter.value)
})
</script>
