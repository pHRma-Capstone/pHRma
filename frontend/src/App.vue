<template>
  <prime-toast />
  <router-view />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import PrimeToast from 'primevue/toast';
import useToastStore from '@/store/toastStore';
import { useToast } from 'primevue/usetoast';
import { watch } from 'vue';

const toast = useToast();
const toastStore = useToastStore();

watch(
  () => toastStore.get(),
  (newValue) => {
    if (newValue) {
      toast.add(newValue);
    }
  }
);
</script>

<style>
html,
body {
  /* primevue components scale with font-size */
  font-size: 14px;
}
</style>
