<template>
  <h1 :class="`flex items-center justify-center h-screen text-${currentColor} animate-[spin_3s_linear_infinite]`">pHRma</h1>
  <div class="hidden">
    <div class="text-red-500"></div>
    <div class="text-green-500"></div>
    <div class="text-blue-500"></div>
    <div class="text-yellow-500"></div>
    <div class="text-purple-500"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const colors = ['red-500', 'green-500', 'blue-500', 'yellow-500', 'purple-500'];
const currentColor = ref(colors[0]);

let index = 0;
setInterval(() => {
  index = (index + 1) % colors.length;
  currentColor.value = colors[index];
}, 1000);
</script>
