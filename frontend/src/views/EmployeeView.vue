<template> 
  <!-- main chart -->
  <div class="row-span-1 col-span-4 md:row-span-2 md:col-span-2 border rounded shadow-md flex flex-col">
    <service-statistics :data="useServiceStatisticsStore().get()" />
  </div>
</template>

<script setup lang="ts">
import ServiceStatistics from '@/components/ServiceStatistics.vue';
import { useServiceStatisticsStore } from '@/store';
import { onMounted } from 'vue';

onMounted(async () => {
  await useServiceStatisticsStore().refresh();
});
</script>
