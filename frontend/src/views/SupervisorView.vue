<template>
  <div class="p-2 grid grid-rows-2 grid-cols-4 gap-2">
    <!-- main chart -->
    <div class="row-span-1 col-span-4 md:row-span-2 md:col-span-2 border rounded shadow-md flex flex-col">
      <service-statistics :data="useServiceStatisticsStore().get()" />
    </div>

    <!-- top left box -->
    <div class="h-1/3 row-span-1 col-span-1 md:h-full md:col-span-1 md:row-span-1 border rounded shadow-md"></div>

    <!-- top right box-->
    <div class="h-1/3 row-span-1 col-span-1 md:h-full md:col-span-1 md:row-span-1 border rounded shadow-md"></div>

    <!-- bottom left box -->
    <div class="h-1/3 row-span-1 col-span-1 md:h-full md:col-span-1 md:row-span-1 border rounded shadow-md"></div>

    <!-- bottom right box -->
    <div class="h-1/3 row-span-1 col-span-1 md:h-full md:col-span-1 md:row-span-1 border rounded shadow-md"></div>
  </div>
</template>

<script setup lang="ts">
import ServiceStatistics from '@/components/ServiceStatistics.vue';
import { useServiceStatisticsStore } from '@/store';
import { onMounted } from 'vue';
// Component Info (props/emits) -------------------------------------------------------

// Template Refs  ---------------------------------------------------------------------

// Variables --------------------------------------------------------------------------

// Reactive Variables -----------------------------------------------------------------

// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------

// Methods ----------------------------------------------------------------------------

// Lifecycle Hooks --------------------------------------------------------------------
onMounted(async () => {
  await useServiceStatisticsStore().refresh();
});
</script>
