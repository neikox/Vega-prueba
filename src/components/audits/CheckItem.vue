<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
  >
    <div class="flex items-start gap-3">
      <!-- Status Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <div
          v-if="check.status === 'PENDING'"
          class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" opacity="0.3" />
          </svg>
        </div>
        <div
          v-else-if="check.status === 'QUEUED'"
          class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 2v6h4" />
          </svg>
        </div>
        <div
          v-else-if="check.status === 'RUNNING'"
          class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div
          v-else-if="check.status === 'OK'"
          class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
            />
          </svg>
        </div>
        <div
          v-else-if="check.status === 'KO'"
          class="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center"
        >
          <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 16 16">
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 mb-2">
          <h4 class="text-sm font-medium text-gray-900 leading-snug">{{ check.title }}</h4>
          <BaseBadge :variant="priorityVariant" class="flex-shrink-0">
            {{ priorityLabel }}
          </BaseBadge>
        </div>

        <div class="flex items-center gap-2 mb-3">
          <BaseBadge :variant="statusVariant">{{ statusLabel }}</BaseBadge>
          <span v-if="check.reviewed" class="text-xs text-gray-500">· Revisado manualmente</span>
        </div>

        <!-- Evidence -->
        <div v-if="check.evidence" class="mb-3 p-3 bg-gray-50 rounded-md">
          <p class="text-xs text-gray-600 leading-relaxed">{{ check.evidence }}</p>
        </div>

        <!-- Actions -->
        <div
          v-if="check.status === 'PENDING'"
          class="flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <button
            @click="$emit('execute', check.id)"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors w-full sm:w-auto"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Ejecutar automáticamente
          </button>

          <button
            @click="$emit('mark-ok', check.id)"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors w-full sm:w-auto"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
              />
            </svg>
            Marcar OK
          </button>

          <button
            @click="$emit('mark-ko', check.id)"
            class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors w-full sm:w-auto"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
            Marcar KO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../ui/Badge.vue'

const props = defineProps({
  check: {
    type: Object,
    required: true,
  },
})

const statusVariant = computed(() => {
  const variants = {
    PENDING: 'default',
    QUEUED: 'info',
    RUNNING: 'info',
    OK: 'success',
    KO: 'danger',
  }
  return variants[props.check.status] || 'default'
})

const statusLabel = computed(() => {
  const labels = {
    PENDING: 'Pendiente',
    QUEUED: 'En cola',
    RUNNING: 'Ejecutando',
    OK: 'Exitoso',
    KO: 'Fallido',
  }
  return labels[props.check.status] || props.check.status
})

const priorityVariant = computed(() => {
  const variants = {
    HIGH: 'danger',
    MEDIUM: 'warning',
    LOW: 'default',
  }
  return variants[props.check.priority] || 'default'
})

const priorityLabel = computed(() => {
  const labels = {
    HIGH: 'Alta',
    MEDIUM: 'Media',
    LOW: 'Baja',
  }
  return labels[props.check.priority] || props.check.priority
})
</script>
