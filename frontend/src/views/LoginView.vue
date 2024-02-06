<template>
  <div class="flex items-center justify-center h-screen">
    <card>
      <template #title>Sign In</template>
      <template #content>
        <div class="flex gap-3">
          <prime-button type="button" label="Employee" @click="useAuthStore().authenticate(Role.EMPLOYEE)" />
          <prime-button type="button" label="Supervisor" @click="useAuthStore().authenticate(Role.SUPERVISOR)" />
        </div>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import PrimeButton from 'primevue/button';
import { Role } from '@/util/types';
import { useAuthStore } from '@/store';
</script>
