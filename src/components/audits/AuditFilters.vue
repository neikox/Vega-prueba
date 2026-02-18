<template>
  <div class="bg-white border border-gray-300 rounded-xl p-6 mb-6">
    <div class="mb-4">
      <div class="relative flex items-center">
        <svg class="absolute left-4 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
        </svg>
        <input
          type="text"
          class="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg text-sm font-[inherit] transition-all focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
          placeholder="Buscar auditorías..."
          :value="modelValue.q"
          @input="updateFilter('q', $event.target.value)"
        />
        <button
          v-if="modelValue.q"
          class="absolute right-3 p-1 bg-transparent border-0 text-gray-400 cursor-pointer rounded transition-all hover:text-gray-600 hover:bg-gray-100"
          @click="updateFilter('q', '')"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-3 md:flex-row flex-col">
      <select
        class="flex-1 min-w-[150px] md:w-auto w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-[inherit] bg-white cursor-pointer transition-all hover:border-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
        :value="modelValue.status"
        @change="updateFilter('status', $event.target.value)"
      >
        <option value="">Todos los estados</option>
        <option value="DRAFT">Borrador</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="DONE">Completada</option>
        <option value="BLOCKED">Bloqueada</option>
      </select>
      
      <select
        class="flex-1 min-w-[150px] md:w-auto w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-[inherit] bg-white cursor-pointer transition-all hover:border-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
        :value="modelValue.process"
        @change="updateFilter('process', $event.target.value)"
      >
        <option value="">Todos los procesos</option>
        <option v-for="process in processes" :key="process" :value="process">
          {{ process }}
        </option>
      </select>
      
      <select
        class="flex-1 min-w-[150px] md:w-auto w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-[inherit] bg-white cursor-pointer transition-all hover:border-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
        :value="modelValue.ownerId"
        @change="updateFilter('ownerId', $event.target.value)"
      >
        <option value="">Todos los responsables</option>
        <option v-for="owner in owners" :key="owner.id" :value="owner.id">
          {{ owner.name }}
        </option>
      </select>
      
      <select
        class="flex-1 min-w-[150px] md:w-auto w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-[inherit] bg-white cursor-pointer transition-all hover:border-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
        :value="modelValue.sort"
        @change="updateFilter('sort', $event.target.value)"
      >
        <option value="updatedAt:desc">Más recientes</option>
        <option value="updatedAt:asc">Más antiguas</option>
        <option value="name:asc">Nombre (A-Z)</option>
        <option value="name:desc">Nombre (Z-A)</option>
        <option value="progress:desc">Mayor progreso</option>
        <option value="progress:asc">Menor progreso</option>
        <option value="targetDate:asc">Fecha límite (próxima)</option>
      </select>
      
      <button 
        v-if="hasActiveFilters"
        class="flex items-center gap-2 py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 cursor-pointer transition-all whitespace-nowrap hover:bg-gray-200 hover:text-gray-700"
        @click="clearFilters"
        title="Limpiar filtros"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
        </svg>
        Limpiar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  processes: {
    type: Array,
    required: true
  },
  owners: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const hasActiveFilters = computed(() => {
  return props.modelValue.q || 
         props.modelValue.status || 
         props.modelValue.process || 
         props.modelValue.ownerId ||
         props.modelValue.sort !== 'updatedAt:desc'
})

function updateFilter(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

function clearFilters() {
  emit('update:modelValue', {
    q: '',
    status: '',
    process: '',
    ownerId: '',
    sort: 'updatedAt:desc'
  })
}
</script>
