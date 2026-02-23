<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Sidebar -->
    <SidebarNav :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content Area -->
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <!-- Topbar -->
      <TopbarNav @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- Content -->
      <main class="flex-1 p-4 lg:p-8">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-6 px-4 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-600">
              <span class="font-semibold">AuditPro</span> · Sistema de Gestión de Auditorías
            </div>
            <div class="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" class="hover:text-indigo-600 transition-colors">Documentación</a>
              <a href="#" class="hover:text-indigo-600 transition-colors">Soporte</a>
              <a href="#" class="hover:text-indigo-600 transition-colors">Acerca de</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SidebarNav from './Sidebar.vue'
import TopbarNav from './Topbar.vue'

const sidebarOpen = ref(false)
</script>
