<template>
  <prime-toolbar>
    <template #end>
      <prime-button type="button" label="Sign Out" icon="pi pi-sign-out" @click="useAuthStore().unauthenticate()" />
    </template>
    <template #start>
      <div class="flex gap-2">
      <router-link to="/"><prime-button label="Home" link/></router-link>
      <router-link to="/upload"><prime-button label="Upload" link/></router-link>
    </div>
    </template>
  </prime-toolbar>
</template>

<script setup lang="ts">
import PrimeToolbar from 'primevue/toolbar';
import PrimeButton from 'primevue/button';
import { useAuthStore } from '@/store';
</script>
