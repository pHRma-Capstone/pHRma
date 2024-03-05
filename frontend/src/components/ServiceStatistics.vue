<template>
  <div class="flex flex-col h-[30rem] w-full">
    <v-chart :option="option" autoresize />
    <div class="flex flex-col gap-2 px-5 pb-5">
      <label for="fromDate">Date Range</label>
      <prime-calendar class="w-1/2" v-model="dateRange" showIcon iconDisplay="input" selectionMode="range" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PrimeCalendar from 'primevue/calendar';
import type { ServiceStatistic } from '@/util/types';
import axios, { type AxiosResponse } from 'axios';
import { computed, ref, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ComposeOption } from 'echarts/core';
import type { LineSeriesOption } from 'echarts/charts';
import type { GridComponentOption } from 'echarts/components';

use([GridComponent, LineChart, CanvasRenderer]);

type EChartsOption = ComposeOption<GridComponentOption | LineSeriesOption>;
type ChartData = { x: Date; y: number };

const option = computed<EChartsOption>(() => {
  return {
    xAxis: {
      type: 'category',
      data: data.value.map((d) => d.x.toDateString()),
      axisLabel: {
        formatter: (value) => {
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
      data: data.value.map((d) => d.y)
    }
  };
});

const data = ref<ChartData[]>([]);
const dateRange = ref<Date[]>([new Date(), new Date()]);

/**
 * Asynchronously loads service statistics data from a specified endpoint
 * and updates the local state with the converted data for chart display.
 *
 * @returns {Promise<void>} A promise that resolves when the data has been fetched
 * and the local state has been updated. The promise does not return any value.
 */
const reloadData = async (): Promise<void> => {
  try {
    // TODO replace with actual endpoint
    const res: AxiosResponse<ServiceStatistic[]> = await axios.get('http://localhost:3000/service_statistics');
    res.data = res.data.map((i) => ({ ...i, day: new Date(i.day) })); // may not need this when backend hooked up, this converts the day to a date
    data.value = convert(res.data);
    dateRange.value = findMinMaxDates(data.value);
  } catch {
    // TODO error handling
    console.error('something bad');
  }
};

/**
 * Converts an array of `ServiceStatistic` objects into an array of `ChartData`
 * objects suitable for chart rendering.
 *
 * @param {ServiceStatistic[]} stats - An array of `ServiceStatistic` objects to be converted.
 *
 * @returns {ChartData[]} An array of `ChartData` objects, each representing a point
 * on a chart with x-axis as the date (`day`) and y-axis as the number of consult notes
 * (`number_consult_notes`).
 */
const convert = (stats: ServiceStatistic[]): ChartData[] => {
  return stats.map((s: ServiceStatistic) => {
    return { x: s.day, y: s.number_consult_notes };
  });
};

/**
 * Finds the minimum and maximum dates in an array of objects with Date properties.
 *
 * @param data An array of objects, each containing a 'day' property of type Date.
 * @returns An array with two elements: the minimum date and the maximum date.
 */
function findMinMaxDates(data: ChartData[]): [Date, Date] | [] {
  if (data.length === 0) {
    return []; // Return an empty array if input data is empty
  }

  let minDate = data[0].x; // Initialize with the first date
  let maxDate = data[0].x; // Initialize with the first date

  for (const d of data) {
    if (d.x < minDate) minDate = d.x;
    if (d.x > maxDate) maxDate = d.x;
  }

  return [minDate, maxDate];
}

onMounted(() => {
  reloadData();
});
</script>
