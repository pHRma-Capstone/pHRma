import api from '@/util/api';
import type { ServiceStatistic } from '@/util/types';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import useToastStore from './toastStore';
import { ref, watch } from 'vue';
import useDateRangeStore from './dateRangeStore';

const useServiceStatisticsStore = defineStore('serviceStatisticsStore', () => {
  const stats = ref<ServiceStatistic[] | undefined>(undefined);
  const dateRangeStore = useDateRangeStore();

  const getParams = () => {
    if (!dateRangeStore.dateRange) {
      return {};
    } else if (dateRangeStore.dateRange[1] === null) {
      return { endDate: dateRangeStore.dateRange[0].toISOString().split('T')[0] };
    } else {
      return { startDate: dateRangeStore.dateRange[0].toISOString().split('T')[0], endDate: dateRangeStore.dateRange[1].toISOString().split('T')[0] };
    }
  };

  const refresh = async () => {
    try {
      const params = getParams();
      const res: AxiosResponse<ServiceStatistic[]> = await api.get('/service-statistics', { params });
      // convert date to Date object, may not need
      res.data = res.data.map((i) => ({ ...i, day: new Date(`${i.day}T00:00`) }));
      stats.value = res.data;
    } catch {
      useToastStore().addError('There was an error fetching service statistics');
    }
  };

  const get = (): ServiceStatistic[] | undefined => {
    return stats.value;
  };

  watch(
    () => dateRangeStore.dateRange,
    () => {
      refresh();
    }
  );

  return {
    refresh,
    get
  };
});

export default useServiceStatisticsStore;
