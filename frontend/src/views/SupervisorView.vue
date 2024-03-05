<template>
  <div class="h-full p-2 grid grid-rows-2 grid-cols-4 gap-2">
    <!-- main chart -->
    <div class="row-span-2 col-span-2 border rounded shadow-md flex flex-col">
      <span class="text-2xl pl-5 pt-5">Consult Notes</span>
      <service-statistics />
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
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import PrimeButton from 'primevue/button';
</script>
