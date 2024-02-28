<template>
  <prime-toolbar>
    <template #end>
      <prime-button type="button" label="Sign Out" icon="pi pi-sign-out" @click="useAuthStore().unauthenticate()" />
    </template>
    <template #start>
      <router-link to="/"></router-link>
    </template>
  </prime-toolbar>
</template>

<script setup lang="ts">
import PrimeToolbar from 'primevue/toolbar';
import PrimeButton from 'primevue/button';
import { useAuthStore } from '@/store';
</script>
