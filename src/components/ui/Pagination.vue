<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-6 gap-4">
    <div class="text-sm text-gray-600 text-center sm:text-left">
      Mostrando {{ start }} - {{ end }} de {{ total }} resultados
    </div>
    
    <div class="flex items-center justify-center gap-2">
      <button 
        class="flex items-center justify-center w-10 h-10 border border-gray-300 bg-white rounded-lg cursor-pointer transition-all text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
        :disabled="currentPage === 1"
        @click="$emit('update:currentPage', currentPage - 1)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 12l-4-4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            'flex items-center justify-center min-w-[2.5rem] h-10 px-3 border rounded-lg cursor-pointer transition-all text-sm font-medium',
            page === currentPage 
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-transparent' 
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          ]"
          @click="$emit('update:currentPage', page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="flex items-center justify-center w-10 h-10 border border-gray-300 bg-white rounded-lg cursor-pointer transition-all text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
        :disabled="currentPage === totalPages"
        @click="$emit('update:currentPage', currentPage + 1)"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePagination'
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  }
})

defineEmits(['update:currentPage'])

const start = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const end = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (props.totalPages <= maxVisible) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    const start = Math.max(1, props.currentPage - 2)
    const end = Math.min(props.totalPages, props.currentPage + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})
</script>
