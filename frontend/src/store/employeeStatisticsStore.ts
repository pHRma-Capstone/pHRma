import api from '@/util/api';
import type { EmployeeStatistic } from '@/util/types';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import useToastStore from './toastStore';
import { ref, watch } from 'vue';
import useDateRangeStore from './dateRangeStore';

const useEmployeeStatisticsStore = defineStore('employeeStatisticsStore', () => {
  const stats = ref<EmployeeStatistic[] | undefined>(undefined);
  const employeeId = ref<number | undefined>(undefined);
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
      const res: AxiosResponse<EmployeeStatistic[]> = await api.get(`/employee-statistics/${employeeId.value}`, { params });
      // convert date to Date object, may not need
      res.data = res.data.map((i) => ({ ...i, day: new Date(`${i.day}T00:00`) }));
      stats.value = res.data;
    } catch {
      useToastStore().addError('There was an error fetching employee statistics');
    }
  };

  const get = (): EmployeeStatistic[] | undefined => {
    return stats.value;
  };

  watch([() => dateRangeStore.dateRange, () => employeeId.value], ([_, newEmployeeId]) => {
    if (newEmployeeId != null) {
      refresh();
    }
  });

  return {
    refresh,
    get,
    employeeId
  };
});

export default useEmployeeStatisticsStore;
