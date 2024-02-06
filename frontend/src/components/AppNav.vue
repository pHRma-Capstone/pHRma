<template>
  <menubar>
    <template #end>
      <prime-button type="button" label="Sign Out" icon="pi pi-sign-out" @click="useAuthStore().unauthenticate()" />
    </template>
  </menubar>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import PrimeButton from 'primevue/button';
import { useAuthStore } from '@/store';
</script>
