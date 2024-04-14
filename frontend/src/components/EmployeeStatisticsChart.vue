<template>
  <div class="flex flex-col h-[40rem] w-full">
    <div class="flex items-center mx-2 mt-3 flex-wrap">
      <prime-dropdown
        class="e-custom-dropdown-3xl w-fit border-none"
        v-model="dropdownSelectedStat"
        :options="dropdownSelectedStatOptions"
        option-label="name"
        option-value="value"
        @change="() => nextTick(chart.resize)"
      />
      <p class="italic mr-3 text-center">for</p>
      <prime-dropdown
        class="e-custom-dropdown-xl border-none"
        :loading="isEmployeeDropdownLoading"
        v-model="dropdownSelectedEmployee"
        :options="dropdownSelectedEmployeeOptions"
        option-label="name"
        option-value="value"
        @change="onEmployeeDropdownChange"
      />
    </div>

    <v-chart ref="chart" :option="option" autoresize />
  </div>
</template>

<script setup lang="ts">
import PrimeDropdown from 'primevue/dropdown';
import type { Employee, EmployeeStatistic, SelectableEmployeeStatistic } from '@/util/types';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption, TooltipComponentOption, DataZoomComponentOption } from 'echarts/components';
import api from '@/util/api';
import type { AxiosResponse } from 'axios';
import { useEmployeeStatisticsStore } from '@/store';
// Component Info (props/emits) -------------------------------------------------------
const props = defineProps<{
  id: string;
  data: EmployeeStatistic[] | undefined;
}>();

// Template Refs  ---------------------------------------------------------------------
const chart = ref({} as InstanceType<typeof VChart>);

// Variables --------------------------------------------------------------------------
const dropdownSelectedStatOptions: { name: string; value: SelectableEmployeeStatistic }[] = [
  { name: 'Consult Notes', value: 'numberConsultNotes' },
  { name: 'Abbreviated Notes', value: 'numberAbbreviatedNotes' },
  { name: 'Medications', value: 'numberMedications' },
  { name: 'Interventions', value: 'numberInterventions' },
  { name: 'Interventions per Consult', value: 'averageInterventionsPerConsult' },
  { name: 'Time per Consult', value: 'averageTimePerConsult' },
  { name: 'Requests', value: 'numberRequests' }
];

// Reactive Variables -----------------------------------------------------------------
const chartData = ref<ChartData[]>([]);
const dropdownSelectedStat = ref<SelectableEmployeeStatistic>('numberConsultNotes');

const dropdownSelectedEmployeeOptions = ref<{ name: string; value: number }[]>([]);
const dropdownSelectedEmployee = ref<number>(1);
const isEmployeeDropdownLoading = ref(false);

// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------
watch(
  [() => props.data, () => dropdownSelectedStat.value],
  () => {
    chartData.value = convert();
    localStorage.setItem(`${props.id}-selected-stat`, dropdownSelectedStat.value);
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
    return props.data.map((s: EmployeeStatistic) => {
      return { x: s.day, y: s[dropdownSelectedStat.value] };
    });
  }
  return [];
};

const reloadEmployees = () => {
  isEmployeeDropdownLoading.value = true;
  api
    .get('/employees')
    .then((res: AxiosResponse<Employee[]>) => {
      dropdownSelectedEmployeeOptions.value = res.data.map((e) => {
        return { name: `${e.firstName} ${e.lastName}`, value: e.id };
      });
    })
    .finally(() => {
      isEmployeeDropdownLoading.value = false;
      chart.value.resize();
    });
};

const onEmployeeDropdownChange = () => {
  localStorage.setItem(`${props.id}-selected-emp`, JSON.stringify(dropdownSelectedEmployee.value));
  useEmployeeStatisticsStore().employeeId = dropdownSelectedEmployee.value;
  nextTick(chart.value.resize);
};

// Lifecycle Hooks --------------------------------------------------------------------
onMounted(() => {
  reloadEmployees();

  let localStat = localStorage.getItem(`${props.id}-selected-stat`) as SelectableEmployeeStatistic | null;
  let localEmployee = localStorage.getItem(`${props.id}-selected-emp`);

  if (localStat) {
    dropdownSelectedStat.value = localStat;
  }

  if (localEmployee) {
    dropdownSelectedEmployee.value = parseInt(localEmployee);
    useEmployeeStatisticsStore().employeeId = dropdownSelectedEmployee.value;
  }
});

// ECharts ----------------------------------------------------------------------------
use([GridComponent, LineChart, CanvasRenderer, TooltipComponent, DataZoomComponent]);

type EChartsOption = ComposeOption<GridComponentOption | LineSeriesOption | TooltipComponentOption | DataZoomComponentOption>;
type ChartData = { x: Date; y: string | number };

const option = computed<EChartsOption>(() => {
  return {
    dataZoom: [
      {
        show: true,
        realtime: true
      },
      {
        type: 'inside',
        realtime: true
      }
    ],
    tooltip: {
      trigger: 'axis', // Show the tooltip when hovering over elements considered part of an axis. This is useful for showing data for each category or date.
      axisPointer: {
        // Use a line as the axis pointer to align with the hovered data
        type: 'line'
      },
      formatter: function (params: any) {
        const date = params[0].axisValueLabel;
        const value = params[0].data;

        return `Date: ${date}<br/>Value: ${value}`;
      }
    },
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
.e-custom-dropdown-3xl .p-dropdown-label {
  font-size: 1.875rem; /** tailwind text-3xl */
  line-height: 2.25rem;
  font-weight: bold;
}

.e-custom-dropdown-xl .p-dropdown-label {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
</style>
