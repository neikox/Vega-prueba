<template>
  <div
    class="bg-white border border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-indigo-600 hover:shadow-lg hover:-translate-y-0.5"
    @click="$emit('click', audit)"
  >
    <div class="flex justify-between items-start gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <h3
          class="text-base font-semibold text-gray-900 mb-1 overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {{ audit.name }}
        </h3>
        <p class="text-xs text-gray-600 m-0">{{ audit.id }}</p>
      </div>
      <BaseBadge :variant="statusVariant">{{ statusLabel }}</BaseBadge>
    </div>

    <div class="mb-4">
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg
            class="text-gray-400 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
          </svg>
          <span>{{ audit.owner.name }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg
            class="text-gray-400 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M3 3h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v6h8V5H4z"
            />
          </svg>
          <span>{{ audit.process }}</span>
        </div>

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <svg
            class="text-gray-400 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              d="M4 1a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5.414a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 009.586 2H4zm3 3v3h3v1H7v3H6v-3H3V7h3V4h1z"
            />
          </svg>
          <span>Vence: {{ formatDate(audit.targetDate) }}</span>
        </div>
      </div>

      <div class="mt-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-medium text-gray-600 uppercase tracking-wider">Progreso</span>
          <span class="text-sm font-semibold text-gray-900">{{ audit.progress }}%</span>
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300 ease-in-out"
            :style="{ width: `${audit.progress}%` }"
            :class="progressColorClass"
          ></div>
        </div>
      </div>
    </div>

    <div class="pt-4 border-t border-gray-100">
      <span class="text-xs text-gray-400">
        Actualizado {{ formatRelativeDate(audit.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../ui/Badge.vue'

const props = defineProps({
  audit: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const statusVariant = computed(() => {
  const variants = {
    DRAFT: 'default',
    IN_PROGRESS: 'info',
    DONE: 'success',
    DONE_WITH_ISSUES: 'warning',
    BLOCKED: 'danger',
  }
  return variants[props.audit.status] || 'default'
})

const statusLabel = computed(() => {
  const labels = {
    DRAFT: 'Borrador',
    IN_PROGRESS: 'En Progreso',
    DONE: 'Completada',
    DONE_WITH_ISSUES: 'Con Incidencias',
    BLOCKED: 'Bloqueada',
  }
  return labels[props.audit.status] || props.audit.status
})

const progressColorClass = computed(() => {
  if (props.audit.progress === 100) {
    // Verde si está completada sin issues, ámbar si tiene issues
    return props.audit.status === 'DONE_WITH_ISSUES' ? 'bg-amber-500' : 'bg-green-500'
  }
  if (props.audit.progress === 0) return 'bg-gray-300'
  return 'bg-gradient-to-r from-indigo-600 to-purple-600'
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatRelativeDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`

  return formatDate(dateString)
}
</script>
