<template>
  <app-nav v-if="!useRoute().meta.noAppNav" />
  <router-view />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import AppNav from './components/AppNav.vue';
</script>

<style>
html {
  /* primevue components scale with font-size */
  font-size: 14px;
}
</style>
