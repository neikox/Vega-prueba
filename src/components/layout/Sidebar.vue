<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b border-indigo-700 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold">AuditPro</h1>
          <p class="text-xs text-indigo-300">Sistema de Auditorías</p>
        </div>
      </div>

      <!-- Close button (mobile) -->
      <button
        @click="$emit('close')"
        class="lg:hidden text-indigo-300 hover:text-white transition-colors"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'hover:bg-indigo-700/50',
          'group',
        ]"
        active-class="bg-indigo-700 shadow-lg ring-2 ring-indigo-500/50"
        @click="$emit('close')"
      >
        <div
          class="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors"
          v-html="item.icon"
        ></div>
        <span class="font-medium text-sm">{{ item.label }}</span>
        <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" v-if="item.badge">
          <span class="px-2 py-0.5 bg-purple-500 text-xs rounded-full">{{ item.badge }}</span>
        </div>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-indigo-700 flex-shrink-0">
      <div class="flex items-center gap-3 px-4 py-3 bg-indigo-800/50 rounded-lg">
        <div
          class="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold"
        >
          VG
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">Vega Evaluador</p>
          <p class="text-xs text-indigo-300 truncate">Admin</p>
        </div>
      </div>

      <div class="mt-4 text-center">
        <p class="text-xs text-indigo-400">v1.0.0 · © 2026</p>
      </div>
    </div>
  </aside>

  <!-- Overlay (mobile) -->
  <div v-if="isOpen" @click="$emit('close')" class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'SidebarNav',
})

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const menuItems = computed(() => [
  {
    path: '/audits',
    label: 'Auditorías',
    icon: `<svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
    </svg>`,
  },
])
</script>
