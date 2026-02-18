<template>
  <div class="bg-white border border-gray-300 rounded-xl p-6">
    <div class="flex justify-between items-start gap-4 mb-4">
      <div class="flex-1 min-w-0">
        <LoadingSkeleton width="70%" height="1.25rem" />
        <LoadingSkeleton width="30%" height="0.875rem" class="mt-2" />
      </div>
      <LoadingSkeleton width="5rem" height="1.75rem" />
    </div>
    
    <div class="mb-4">
      <LoadingSkeleton width="60%" height="0.875rem" class="mb-2" />
      <LoadingSkeleton width="50%" height="0.875rem" class="mb-2" />
      <LoadingSkeleton width="55%" height="0.875rem" />
      
      <div class="mt-4">
        <LoadingSkeleton width="40%" height="0.75rem" class="mb-2" />
        <LoadingSkeleton width="100%" height="0.5rem" />
      </div>
    </div>
    
    <div class="pt-4 border-t border-gray-100">
      <LoadingSkeleton width="45%" height="0.75rem" />
    </div>
  </div>
</template>

<script setup>
import LoadingSkeleton from '../ui/LoadingSkeleton.vue'
</script>
