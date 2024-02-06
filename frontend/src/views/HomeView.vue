<template>
  <div class="flex justify-center items-center h-[calc(100vh-5rem)]">
    <span v-if="useAuthStore().getRole() === Role.EMPLOYEE" class="text-2xl">hello employee</span>
    <span v-else class="text-2xl">hello supervisor</span>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store';
import { Role } from '@/util/types';
</script>
