<template>
  <menubar class="mx-2 mt-2 shadow-md">
    <template #start>
      <div class="flex gap-2 items-center">
        <img class="h-11 ml-1" :src="MuLogo" />
        <span class="text-3xl ml-2 font-serif text-black merriweather-regular">pHRma</span>
      </div>
    </template>
    <template #end>
      <div class="flex gap-2">
        <router-link to="/"><prime-button label="Home" link/></router-link>
        <router-link to="/upload"><prime-button label="Upload" link/></router-link>
        <prime-button type="button" label="Sign Out" icon="pi pi-sign-out" @click="useAuthStore().unauthenticate()" />
      </div>
    </template>
  </menubar>
</template>

<script setup lang="ts">
import PrimeToolbar from 'primevue/toolbar';
import PrimeButton from 'primevue/button';
import { useAuthStore } from '@/store';
import MuLogo from '@/assets/mu.png';
import Menubar from 'primevue/menubar';
</script>

<style>
.merriweather-regular {
  font-family: 'Merriweather', serif;
  font-weight: 400;
  font-style: normal;
}
</style>
