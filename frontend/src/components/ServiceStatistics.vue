<template>
  <div class="flex flex-col h-[40rem] w-full">
    <prime-dropdown
      class="custom-dropdown ml-2 mt-3 w-fit border-none"
      v-model="dropdownSelectedStat"
      :options="dropdownSelectedStatOptions"
      option-label="name"
      option-value="value"
    />
    <v-chart :option="option" autoresize />
    <div class="flex flex-col gap-2 ml-5 mb-5">
      <label for="fromDate">Date Range</label>
      <div class="flex gap-2">
        <prime-calendar
          class="w-1/2"
          v-model="store.dateRange"
          showIcon
          iconDisplay="input"
          selectionMode="range"
          @update:model-value="dropdownDateRange = undefined"
        />
        <prime-dropdown
          v-model="dropdownDateRange"
          :options="dropdownDateRangeOptions"
          placeholder="Select a Range"
          option-label="name"
          option-value="value"
          @update:model-value="if (dropdownDateRange) dropdownDateRange();"
        ></prime-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PrimeCalendar from 'primevue/calendar';
import PrimeDropdown from 'primevue/dropdown';
import type { SelectableServiceStatistic, ServiceStatistic } from '@/util/types';
import { computed, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption } from 'echarts/components';
import { useServiceStatisticsStore } from '@/store';
// Component Info (props/emits) -------------------------------------------------------
const props = defineProps<{
  data: ServiceStatistic[] | undefined;
}>();

// Template Refs  ---------------------------------------------------------------------

// Variables --------------------------------------------------------------------------
const dropdownSelectedStatOptions: { name: string; value: SelectableServiceStatistic }[] = [
  { name: 'Consult Notes', value: 'numberConsultNotes' },
  { name: 'Abbreviated Notes', value: 'numberAbbreviatedNotes' },
  { name: 'Medications', value: 'numberMedications' },
  { name: 'Interventions', value: 'numberInterventions' },
  { name: 'Interventions per Consult', value: 'averageInterventionsPerConsult' },
  { name: 'Time per Consult', value: 'averageTimePerConsult' },
  { name: 'Requests', value: 'numberRequests' }
];

const dropdownDateRangeOptions: { name: string; value: () => void }[] = [
  {
    name: 'All Time',
    value: () => {
      store.dateRange = null;
    }
  },
  {
    name: 'Last Week',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      store.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last Month',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
      store.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last 6 Months',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 6);
      store.dateRange = [startDate, endDate];
    }
  },
  {
    name: 'Last Year',
    value: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
      store.dateRange = [startDate, endDate];
    }
  }
];

// Reactive Variables -----------------------------------------------------------------
const store = useServiceStatisticsStore();
const chartData = ref<ChartData[]>([]);
const dropdownSelectedStat = ref<SelectableServiceStatistic>('numberConsultNotes');
const dropdownDateRange = ref<undefined | (() => void)>(undefined);

// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------
watch(
  [() => props.data, () => dropdownSelectedStat.value],
  () => {
    chartData.value = convert();
  },
  {
    deep: true
  }
);

// Methods ----------------------------------------------------------------------------
/**
 * Converts an array of `ServiceStatistic` objects into an array of `ChartData`
 * objects suitable for chart rendering.
 *
 * @returns {ChartData[]} An array of `ChartData` objects.
 */
const convert = (): ChartData[] => {
  if (props.data) {
    return props.data.map((s: ServiceStatistic) => {
      return { x: s.day, y: s[dropdownSelectedStat.value] };
    });
  }
  return [];
};

// Lifecycle Hooks --------------------------------------------------------------------

// ECharts ----------------------------------------------------------------------------
use([GridComponent, LineChart, CanvasRenderer]);

type EChartsOption = ComposeOption<GridComponentOption | LineSeriesOption>;
type ChartData = { x: Date; y: string | number };

const option = computed<EChartsOption>(() => {
  return {
    xAxis: {
      type: 'category',
      data: chartData.value.map((d) => d.x.toDateString()),
      axisLabel: {
        formatter: (value: string) => {
          const date = new Date(value);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          });
          return formattedDate;
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series: {
      type: 'line',
      data: chartData.value.map((d) => d.y)
    }
  };
});
</script>

<style>
.custom-dropdown .p-dropdown-label {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: bold;
}
</style>
