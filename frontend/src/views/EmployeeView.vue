<template>
    <div class="h-full p-2 grid grid-rows-2 grid-cols-4 gap-2">
      <!-- main chart -->
      <div class="row-span-2 col-span-2 border rounded shadow-md flex items-center">
        <v-chart :option="option" autoresize />
      </div>
  
      <!-- top left box -->
      <div class="col-span-1 row-span-1 border rounded shadow-md flex flex-col items-center">
        <float-label class="mt-7">
          <input-text id="name" class="border" v-model="name" autocomplete="off" />
          <label for="name">X-Axis</label>
        </float-label>
  
        <float-label class="mt-7">
          <input-text id="number" type="number" v-model="number" autocomplete="off" />
          <label for="number">Y-Axis</label>
        </float-label>
  
        <prime-button class="my-5" label="Submit" @click="submit" />
      </div>
  
      <!-- top right box-->
      <div class="col-span-1 row-span-1 border rounded shadow-md"></div>
  
      <!-- bottom left box -->
      <div class="col-span-2 row-span-1 border rounded shadow-md">
        <span>{{ response }}</span>
      </div>

    </div>
  </template>
  
  <script setup lang="ts">
  
  import VChart from 'vue-echarts';
  import InputText from 'primevue/inputtext';
  import FloatLabel from 'primevue/floatlabel';
  import PrimeButton from 'primevue/button';
  import api from '@/util/api';
  import { use } from 'echarts/core';
  import { Role, type Employee } from '@/util/types';
  import { LineChart } from 'echarts/charts';
  import { GridComponent } from 'echarts/components';
  import { SVGRenderer } from 'echarts/renderers';
  import type { AxiosResponse } from 'axios';
  import type { ComposeOption } from 'echarts/core';
  import type { LineSeriesOption } from 'echarts/charts';
  import type { GridComponentOption } from 'echarts/components';
  import { computed, ref } from 'vue';
  
  use([GridComponent, LineChart, SVGRenderer]);
  
  type EChartsOption = ComposeOption<GridComponentOption | LineSeriesOption>;
  
  const d = ref<{ [key: string]: number }>({ A: 234, B: 56 });
  const name = ref('');
  const number = ref();
  
  const option = computed<EChartsOption>(() => {
    return {
      xAxis: {
        type: 'category',
        data: Object.keys(d.value)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: Object.values(d.value)
        }
      ]
    };
  });

const response = ref<Array<Employee>>([]);
api.get('/employees').then((res: AxiosResponse<Array<Employee>>) => {
  response.value = res.data;
});
  
  const submit = () => {
    d.value[name.value] = number.value;
  };
  </script>
  