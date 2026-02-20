<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Nueva Auditoría</h1>
      <p class="text-base text-gray-600">Completa los pasos para crear una nueva auditoría</p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-12">
      <div class="flex items-center">
        <!-- Step 1 -->
        <div class="flex items-center flex-1">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
            :class="currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            1
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-gray-900">Datos Básicos</p>
            <p class="text-xs text-gray-500">Información general de la auditoría</p>
          </div>
        </div>

        <!-- Connector -->
        <div
          class="w-16 h-1 mx-4 transition-colors"
          :class="currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'"
        ></div>

        <!-- Step 2 -->
        <div class="flex items-center flex-1">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
            :class="currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'"
          >
            2
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-semibold text-gray-900">Checklist</p>
            <p class="text-xs text-gray-500">Selecciona un modelo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <!-- Step 1: Basic Data -->
      <div v-if="currentStep === 1">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Datos Básicos</h2>

        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Auditoría <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Ej: Auditoría de Seguridad Q1 2026"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Process -->
          <div>
            <label for="process" class="block text-sm font-medium text-gray-700 mb-2">
              Proceso <span class="text-red-500">*</span>
            </label>
            <select
              id="process"
              v-model="formData.process"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': errors.process }"
            >
              <option value="">Selecciona un proceso</option>
              <option v-for="proc in processes" :key="proc" :value="proc">
                {{ proc }}
              </option>
            </select>
            <p v-if="errors.process" class="mt-1 text-sm text-red-500">{{ errors.process }}</p>
          </div>

          <!-- Owner -->
          <div>
            <label for="ownerId" class="block text-sm font-medium text-gray-700 mb-2">
              Responsable <span class="text-red-500">*</span>
            </label>
            <select
              id="ownerId"
              v-model="formData.ownerId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500': errors.ownerId }"
            >
              <option value="">Selecciona un responsable</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }}
              </option>
            </select>
            <p v-if="errors.ownerId" class="mt-1 text-sm text-red-500">{{ errors.ownerId }}</p>
          </div>

          <!-- Target Date -->
          <div>
            <label for="targetDate" class="block text-sm font-medium text-gray-700 mb-2">
              Fecha Objetivo
            </label>
            <input
              id="targetDate"
              v-model="formData.targetDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p class="mt-1 text-xs text-gray-500">
              Si no especificas una fecha, se asignará automáticamente 30 días desde hoy
            </p>
          </div>
        </div>
      </div>

      <!-- Step 2: Template Selection -->
      <div v-if="currentStep === 2">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Selecciona un Modelo de Checklist</h2>

        <!-- Loading -->
        <div v-if="loadingTemplates" class="text-center py-12">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
          ></div>
          <p class="mt-4 text-gray-600">Cargando plantillas...</p>
        </div>

        <!-- Templates Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="template in templates"
            :key="template.id"
            class="border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md"
            :class="
              formData.templateId === template.id
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                : 'border-gray-300 hover:border-indigo-400'
            "
            @click="selectTemplate(template.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ template.name }}</h3>
                <span
                  class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                >
                  {{ template.process }}
                </span>
              </div>
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3"
                :class="
                  formData.templateId === template.id
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300'
                "
              >
                <svg
                  v-if="formData.templateId === template.id"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="white"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-3">
              <span class="font-medium">{{ template.checkCount }}</span> verificaciones
            </p>

            <!-- Preview Checks -->
            <div class="space-y-2">
              <p class="text-xs font-medium text-gray-700 mb-2">Vista previa:</p>
              <div
                v-for="(check, index) in template.checksPreview.slice(0, 3)"
                :key="index"
                class="flex items-center text-xs text-gray-600"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" class="mr-2 flex-shrink-0">
                  <rect
                    x="2"
                    y="2"
                    width="8"
                    height="8"
                    rx="1"
                    stroke="currentColor"
                    stroke-width="1.5"
                    fill="none"
                  />
                </svg>
                <span class="truncate">{{ check.title }}</span>
              </div>
              <p v-if="template.checkCount > 3" class="text-xs text-gray-500 ml-5">
                +{{ template.checkCount - 3 }} más...
              </p>
            </div>
          </div>
        </div>

        <p v-if="errors.templateId" class="mt-4 text-sm text-red-500">{{ errors.templateId }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between">
      <BaseButton
        v-if="currentStep === 2"
        variant="secondary"
        @click="previousStep"
        :disabled="creating"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="mr-2">
          <path
            d="M9.5 13.5L4.5 8.5L9.5 3.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
        Anterior
      </BaseButton>

      <BaseButton v-else variant="secondary" @click="cancel"> Cancelar </BaseButton>

      <BaseButton v-if="currentStep === 1" @click="nextStep">
        Siguiente
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="ml-2">
          <path
            d="M6.5 3.5L11.5 8.5L6.5 13.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
      </BaseButton>

      <BaseButton v-else @click="createAuditSubmit" :disabled="!formData.templateId || creating">
        <span v-if="creating">
          <svg class="animate-spin inline-block mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
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
          Creando...
        </span>
        <span v-else>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="mr-2 inline-block"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
          Crear Auditoría
        </span>
      </BaseButton>
    </div>

    <!-- Error Alert -->
    <div v-if="createError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-500 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error al crear auditoría</h3>
          <p class="mt-1 text-sm text-red-700">{{ createError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import { getTemplates, getOwners, getProcesses, createAudit } from '../services/auditService.js'

const router = useRouter()

// State
const currentStep = ref(1)
const loadingTemplates = ref(false)
const creating = ref(false)
const createError = ref('')

const formData = reactive({
  name: '',
  process: '',
  ownerId: '',
  targetDate: '',
  templateId: '',
})

const errors = reactive({
  name: '',
  process: '',
  ownerId: '',
  templateId: '',
})

const templates = ref([])
const owners = ref([])
const processes = ref([])

// Methods
async function loadMetadata() {
  try {
    const [ownersData, processesData] = await Promise.all([getOwners(), getProcesses()])
    owners.value = ownersData
    processes.value = processesData
  } catch (err) {
    console.error('Error loading metadata:', err)
  }
}

async function loadTemplates() {
  try {
    loadingTemplates.value = true
    templates.value = await getTemplates()
  } catch (err) {
    console.error('Error loading templates:', err)
  } finally {
    loadingTemplates.value = false
  }
}

function validateStep1() {
  // Reset errors
  errors.name = ''
  errors.process = ''
  errors.ownerId = ''

  let isValid = true

  if (!formData.name.trim()) {
    errors.name = 'El nombre es obligatorio'
    isValid = false
  }

  if (!formData.process) {
    errors.process = 'Debes seleccionar un proceso'
    isValid = false
  }

  if (!formData.ownerId) {
    errors.ownerId = 'Debes seleccionar un responsable'
    isValid = false
  }

  return isValid
}

function nextStep() {
  if (validateStep1()) {
    currentStep.value = 2
    loadTemplates()
  }
}

function previousStep() {
  currentStep.value = 1
}

function selectTemplate(templateId) {
  formData.templateId = templateId
  errors.templateId = ''
}

async function createAuditSubmit() {
  if (!formData.templateId) {
    errors.templateId = 'Debes seleccionar un modelo de checklist'
    return
  }

  try {
    creating.value = true
    createError.value = ''

    const response = await createAudit({
      name: formData.name,
      process: formData.process,
      ownerId: formData.ownerId,
      targetDate: formData.targetDate,
      templateId: formData.templateId,
    })

    // Redirect to detail
    router.push(`/audits/${response.audit.id}`)
  } catch (err) {
    createError.value = err.message || 'Error al crear la auditoría'
    console.error('Error creating audit:', err)
  } finally {
    creating.value = false
  }
}

function cancel() {
  router.push('/audits')
}

// Lifecycle
onMounted(() => {
  loadMetadata()
})
</script>
