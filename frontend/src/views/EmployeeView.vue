<template>
  <!-- main chart -->
  <div class="p-10">
    <div class="row-span-1 col-span-4 md:row-span-2 md:col-span-2 border rounded shadow-md flex flex-col">
      <service-statistics-chart :data="useServiceStatisticsStore().get()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ServiceStatisticsChart from '@/components/ServiceStatisticsChart.vue';
import { useServiceStatisticsStore } from '@/store';
import { onMounted } from 'vue';

onMounted(async () => {
  await useServiceStatisticsStore().refresh();
});
</script>
