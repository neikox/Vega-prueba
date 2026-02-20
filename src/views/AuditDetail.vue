<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="$router.push('/audits')"
          class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a auditorías
        </button>

        <h1 class="text-3xl font-bold text-gray-900">Detalle de Auditoría</h1>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <svg
            class="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
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
          <p class="text-gray-600">Cargando auditoría...</p>
        </div>
      </div>

      <!-- Error state -->
      <ErrorState v-else-if="error" :message="error" @retry="loadAuditData" />

      <!-- Content -->
      <div v-else-if="audit" class="space-y-6">
        <!-- Resumen de la auditoría -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ audit.name }}</h2>
                <p class="text-sm text-gray-500">{{ audit.id }}</p>
              </div>
              <BaseBadge :variant="statusVariant" class="text-base px-4 py-2">
                {{ statusLabel }}
              </BaseBadge>
            </div>

            <!-- Grid de información -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Responsable</span
                  >
                </div>
                <p class="text-base font-semibold text-gray-900">{{ audit.owner.name }}</p>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      d="M3 3h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v6h8V5H4z"
                    />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Proceso</span
                  >
                </div>
                <p class="text-base font-semibold text-gray-900">{{ audit.process }}</p>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      d="M11 1a2 2 0 00-2 2v1H7V3a2 2 0 10-4 0v1a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 00-2-2zM5 3a1 1 0 012 0v2H5V3zm8 3v8H3V6h10z"
                    />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Fecha objetivo</span
                  >
                </div>
                <p class="text-base font-semibold text-gray-900">
                  {{ formatDate(audit.targetDate) }}
                </p>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                    <path
                      d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 13A6 6 0 118 2a6 6 0 010 12zm1-6V4H7v5h5V7H9z"
                    />
                  </svg>
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >Última actualización</span
                  >
                </div>
                <p class="text-base font-semibold text-gray-900">
                  {{ formatRelativeDate(audit.updatedAt) }}
                </p>
              </div>
            </div>

            <!-- Barra de progreso -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >Progreso de la auditoría</span
                >
                <span class="text-2xl font-bold text-gray-900">{{ audit.progress }}%</span>
              </div>
              <div class="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${audit.progress}%` }"
                  :class="progressColorClass"
                ></div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex items-center gap-3">
              <BaseButton
                v-if="canExecute"
                @click="executeAudit"
                :disabled="executing"
                variant="primary"
                class="flex items-center gap-2"
              >
                <svg
                  v-if="!executing"
                  class="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
                <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                {{ executing ? 'Ejecutando...' : 'Ejecutar auditoría' }}
              </BaseButton>

              <span v-if="executing" class="text-sm text-gray-600">
                Los checks se están ejecutando progresivamente
              </span>

              <span v-if="audit.status === 'DONE'" class="text-sm text-emerald-600 font-medium">
                ✓ Auditoría completada exitosamente - Todos los checks pasaron
              </span>

              <span
                v-if="audit.status === 'DONE_WITH_ISSUES'"
                class="text-sm text-amber-600 font-medium"
              >
                ⚠ Auditoría completada con incidencias - Se detectaron checks fallidos que requieren
                atención
              </span>
            </div>
          </div>
        </div>

        <!-- Lista de checks -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Verificaciones (Checks)</h3>
          <CheckList
            :checks="checks"
            @execute="handleExecuteCheck"
            @mark-ok="handleMarkOk"
            @mark-ko="handleMarkKo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAuditById, runAudit, executeCheck, updateCheckManual } from '@/services/auditService'
import BaseBadge from '@/components/ui/Badge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import CheckList from '@/components/audits/CheckList.vue'

const route = useRoute()
const auditId = route.params.id

const audit = ref(null)
const checks = ref([])
const loading = ref(true)
const error = ref(null)
const executing = ref(false)
let pollingInterval = null

// Cargar datos de la auditoría
async function loadAuditData() {
  try {
    loading.value = true
    error.value = null

    const response = await getAuditById(auditId)
    audit.value = response.audit
    checks.value = response.checks
  } catch (err) {
    error.value = err.message || 'Error al cargar la auditoría'
  } finally {
    loading.value = false
  }
}

// Ejecutar auditoría
async function executeAudit() {
  try {
    executing.value = true
    await runAudit(auditId)

    // Iniciar polling para actualizar estados
    startPolling()
  } catch (err) {
    error.value = err.message || 'Error al ejecutar la auditoría'
    executing.value = false
  }
}

// Ejecutar un check individual
async function handleExecuteCheck(checkId) {
  try {
    await executeCheck(auditId, checkId)

    // Iniciar polling si no está activo
    startPolling()
  } catch (err) {
    error.value = err.message || 'Error al ejecutar el check'
    console.error('Error ejecutando check:', err)
  }
}

// Marcar check como OK manualmente
async function handleMarkOk(checkId) {
  try {
    await updateCheckManual(
      auditId,
      checkId,
      'OK',
      'Verificación marcada como exitosa manualmente.',
    )

    // Recargar datos
    await loadAuditData()
  } catch (err) {
    error.value = err.message || 'Error al actualizar el check'
    console.error('Error marcando OK:', err)
  }
}

// Marcar check como KO manualmente
async function handleMarkKo(checkId) {
  try {
    await updateCheckManual(
      auditId,
      checkId,
      'KO',
      'Verificación marcada como fallida manualmente. Requiere revisión y acciones correctivas.',
    )

    // Recargar datos
    await loadAuditData()
  } catch (err) {
    error.value = err.message || 'Error al actualizar el check'
    console.error('Error marcando KO:', err)
  }
}

// Polling para actualizar datos durante ejecución
function startPolling() {
  if (pollingInterval) return

  pollingInterval = setInterval(async () => {
    try {
      const response = await getAuditById(auditId)
      audit.value = response.audit
      checks.value = response.checks

      // Detener polling si no hay checks ejecutándose
      const hasRunningChecks = checks.value.some((c) => ['QUEUED', 'RUNNING'].includes(c.status))

      if (!hasRunningChecks) {
        stopPolling()
        executing.value = false
      }
    } catch (err) {
      console.error('Error al actualizar datos:', err)
    }
  }, 1000) // Actualizar cada segundo
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

// Computed properties
const statusVariant = computed(() => {
  const variants = {
    DRAFT: 'default',
    IN_PROGRESS: 'info',
    DONE: 'success',
    DONE_WITH_ISSUES: 'warning',
    BLOCKED: 'danger',
  }
  return variants[audit.value?.status] || 'default'
})

const statusLabel = computed(() => {
  const labels = {
    DRAFT: 'Borrador',
    IN_PROGRESS: 'En Progreso',
    DONE: 'Completada',
    DONE_WITH_ISSUES: 'Completada con Incidencias',
    BLOCKED: 'Bloqueada',
  }
  return labels[audit.value?.status] || audit.value?.status
})

const progressColorClass = computed(() => {
  if (!audit.value) return 'bg-gray-300'
  if (audit.value.progress === 100) return 'bg-emerald-500'
  if (audit.value.progress === 0) return 'bg-gray-300'
  return 'bg-gradient-to-r from-indigo-600 to-purple-600'
})

const canExecute = computed(() => {
  return (
    audit.value &&
    !['DONE', 'DONE_WITH_ISSUES'].includes(audit.value.status) &&
    !executing.value &&
    checks.value.some((c) => c.status === 'PENDING')
  )
})

// Utilidades de formato
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
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

  if (diffMins < 1) return 'ahora mismo'
  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`

  return formatDate(dateString)
}

// Lifecycle
onMounted(() => {
  loadAuditData()
})

onUnmounted(() => {
  stopPolling()
})
</script>
