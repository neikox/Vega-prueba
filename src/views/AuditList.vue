<template>
  <div class="max-w-full">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Auditorías</h1>
        <p class="text-base text-gray-600 m-0">Gestiona y monitorea todas tus auditorías</p>
      </div>
      <BaseButton @click="navigateToNew">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
        </svg>
        Nueva Auditoría
      </BaseButton>
    </div>

    <!-- Filters -->
    <AuditFilters
      v-model="filters"
      :processes="processes"
      :owners="owners"
      @update:model-value="onFiltersChange"
    />

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6 mb-8">
      <AuditCardSkeleton v-for="n in 6" :key="n" />
    </div>

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      :loading="retrying"
      @retry="loadAudits"
    />

    <!-- Empty State -->
    <EmptyState v-else-if="audits.length === 0">
      <template #icon>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="16" width="40" height="36" rx="4" stroke="#d1d5db" stroke-width="2"/>
          <path d="M22 28h20M22 36h16M22 44h12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </template>
      <template #title>
        {{ hasFilters ? 'No se encontraron auditorías' : 'No hay auditorías' }}
      </template>
      <template #description>
        {{ hasFilters 
          ? 'No hay auditorías que coincidan con los filtros aplicados. Intenta ajustar los criterios de búsqueda.' 
          : 'Comienza creando tu primera auditoría para empezar a gestionar tus procesos de control.'
        }}
      </template>
      <template #action>
        <BaseButton v-if="hasFilters" variant="secondary" @click="clearFilters">
          Limpiar filtros
        </BaseButton>
        <BaseButton v-else @click="navigateToNew">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
          </svg>
          Crear primera auditoría
        </BaseButton>
      </template>
    </EmptyState>

    <!-- Audits Grid -->
    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6 mb-8">
        <AuditCard
          v-for="audit in audits"
          :key="audit.id"
          :audit="audit"
          @click="navigateToDetail(audit.id)"
        />
      </div>

      <!-- Pagination -->
      <BasePagination
        v-if="pagination.totalPages > 1"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        @update:current-page="onPageChange"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAudits, getOwners, getProcesses } from '../services/auditService.js'
import AuditFilters from '../components/audits/AuditFilters.vue'
import AuditCard from '../components/audits/AuditCard.vue'
import AuditCardSkeleton from '../components/audits/AuditCardSkeleton.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import ErrorState from '../components/ui/ErrorState.vue'
import BasePagination from '../components/ui/Pagination.vue'

const router = useRouter()
const route = useRoute()

// State
const audits = ref([])
const owners = ref([])
const processes = ref([])
const loading = ref(false)
const error = ref(null)
const retrying = ref(false)

const filters = reactive({
  q: '',
  status: '',
  process: '',
  ownerId: '',
  sort: 'updatedAt:desc'
})

const pagination = reactive({
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 1
})

// Computed
const hasFilters = computed(() => {
  return filters.q || filters.status || filters.process || filters.ownerId
})

// Methods
async function loadAudits() {
  loading.value = true
  error.value = null
  
  try {
    const response = await getAudits({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters
    })
    
    audits.value = response.items
    pagination.total = response.total
    pagination.totalPages = response.totalPages
    pagination.page = response.page
  } catch (err) {
    error.value = err.message
    console.error('Error loading audits:', err)
  } finally {
    loading.value = false
    retrying.value = false
  }
}

async function loadMetadata() {
  try {
    const [ownersData, processesData] = await Promise.all([
      getOwners(),
      getProcesses()
    ])
    owners.value = ownersData
    processes.value = processesData
  } catch (err) {
    console.error('Error loading metadata:', err)
  }
}

function onFiltersChange() {
  // Reset to page 1 when filters change
  pagination.page = 1
  updateUrlParams()
  loadAudits()
}

function onPageChange(page) {
  pagination.page = page
  updateUrlParams()
  loadAudits()
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  filters.q = ''
  filters.status = ''
  filters.process = ''
  filters.ownerId = ''
  filters.sort = 'updatedAt:desc'
  pagination.page = 1
  updateUrlParams()
  loadAudits()
}

function updateUrlParams() {
  const query = {}
  
  if (pagination.page > 1) query.page = pagination.page
  if (filters.q) query.q = filters.q
  if (filters.status) query.status = filters.status
  if (filters.process) query.process = filters.process
  if (filters.ownerId) query.ownerId = filters.ownerId
  if (filters.sort !== 'updatedAt:desc') query.sort = filters.sort
  
  router.replace({ query })
}

function loadFromUrlParams() {
  const query = route.query
  
  pagination.page = parseInt(query.page) || 1
  filters.q = query.q || ''
  filters.status = query.status || ''
  filters.process = query.process || ''
  filters.ownerId = query.ownerId || ''
  filters.sort = query.sort || 'updatedAt:desc'
}

function navigateToNew() {
  router.push('/audits/new')
}

function navigateToDetail(id) {
  router.push(`/audits/${id}`)
}

// Lifecycle
onMounted(() => {
  loadFromUrlParams()
  loadMetadata()
  loadAudits()
})

// Watch route changes (browser back/forward)
watch(() => route.query, () => {
  if (route.path === '/audits') {
    loadFromUrlParams()
    loadAudits()
  }
}, { deep: true })
</script>
