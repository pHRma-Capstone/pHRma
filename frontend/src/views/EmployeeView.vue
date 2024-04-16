<template>
  <div class="flex flex-col gap-2 p-2">
    <!-- date range selector -->
    <div class="border rounded shadow-md flex flex-col gap-2 p-3">
      <label for="fromDate">Date Range</label>
      <div class="flex gap-2">
        <prime-calendar
          class="w-1/2"
          v-model="dateRangeStore.dateRange"
          showIcon
          iconDisplay="input"
          selectionMode="range"
          @update:model-value="dropdownDateRange = undefined"
        />
        <prime-dropdown
          class="w-1/3"
          v-model="dropdownDateRange"
          :options="dropdownDateRangeOptions"
          placeholder="Select a Range"
          option-label="name"
          option-value="value"
          @update:model-value="if (dropdownDateRange) dropdownDateRange();"
        />
      </div>
    </div>

    <div class="grid grid-rows-1 grid-cols-4 gap-2">
      <div v-for="i in Array(4).keys()" :key="i" class="row-span-1 col-span-1 md:h-full md:col-span-1 md:row-span-1 border rounded shadow-md">
        <single-stat :id="`emp-single-stat-${i}`" :data="serviceStatisticsStore.get()" />
      </div>
    </div>

    <!-- main chart -->
    <div class="row-span-1 col-span-2 md:row-span-1 md:col-span-1 border rounded shadow-md flex flex-col pb-5">
      <service-statistics-chart id="emp-serv-stats-chart" :data="serviceStatisticsStore.get()" />
    </div>

    <div class="border rounded shadow-md flex gap-2 p-3">
      <service-statistics-table :data="serviceStatisticsStore.get()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ServiceStatisticsChart from '@/components/ServiceStatisticsChart.vue';
import ServiceStatisticsTable from '@/components/ServiceStatisticsTable.vue';
import SingleStat from '@/components/SingleStat.vue';
import { useDateRangeStore, useServiceStatisticsStore } from '@/store';
import { onMounted, ref } from 'vue';
import PrimeCalendar from 'primevue/calendar';
import PrimeDropdown from 'primevue/dropdown';
// Component Info (props/emits) -------------------------------------------------------

// Template Refs  ---------------------------------------------------------------------

// Variables --------------------------------------------------------------------------
const dropdownDateRangeOptions: { name: string; value: () => void }[] = [
  {
    name: 'All Time',
    value: () => {
      dateRangeStore.dateRange = null;
    }
  },
  {
    name: 'Last Week',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      dateRangeStore.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last Month',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      dateRangeStore.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last 6 Months',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      dateRangeStore.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last Year',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      dateRangeStore.dateRange = [startDate, endDate];
    }
  }
];

// Reactive Variables -----------------------------------------------------------------
const serviceStatisticsStore = useServiceStatisticsStore();
const dateRangeStore = useDateRangeStore();

const dropdownDateRange = ref<undefined | (() => void)>(dropdownDateRangeOptions[1].value);

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
