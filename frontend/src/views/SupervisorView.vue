<template>
  <div class="h-full p-2 grid grid-rows-2 grid-cols-4 gap-2">
    <!-- main chart -->
    <div class="row-span-2 col-span-2 border rounded shadow-md flex flex-col">
      <service-statistics :data="useServiceStatisticsStore().get()" @update:date-range="useServiceStatisticsStore().refresh()" />
    </div>

    <!-- top left box -->
    <div class="col-span-1 row-span-1 border rounded shadow-md"></div>

    <!-- top right box-->
    <div class="col-span-1 row-span-1 border rounded shadow-md"></div>

    <!-- bottom left box -->
    <div class="col-span-1 row-span-1 border rounded shadow-md"></div>

    <!-- bottom right box -->
    <div class="col-span-1 row-span-1 border rounded shadow-md"></div>
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
