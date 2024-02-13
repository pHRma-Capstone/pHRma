<template>
  <div class="flex flex-col justify-center items-center h-[calc(100vh-5rem)]">
    <span v-if="useAuthStore().getRole() === Role.EMPLOYEE" class="text-2xl">hello employee</span>
    <span v-else class="text-2xl">hello supervisor</span>
    <span>{{ response }}</span>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store';
import { Role } from '@/util/types';
import api from '@/util/api';
import { ref } from 'vue';

const response = ref('');

api.get('/').then((res) => {
  response.value = res.data;
});
</script>
