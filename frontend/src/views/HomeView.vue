<template>
  <div id="main-content" class="2xl:px-96">
    <app-nav />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppNav from '@/components/AppNav.vue';
</script>
