import router from '@/router';
import { Role, type EmployeeStatistic, type ServiceStatistic } from '@/util/types';
import { type AxiosResponse } from 'axios';
import api from '@/util/api';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useServiceStatisticsStore = defineStore('serviceStatisticsStore', () => {
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
      // TODO error handling
      console.error('something bad happened');
    }
  };

  const get = (): ServiceStatistic[] | undefined => {
    return stats.value;
  };

  watch(
    () => dateRangeStore.dateRange,
    (newValue) => {
      if ((newValue && newValue[1] !== null) || newValue === null) {
        refresh();
      }
    }
  );

  return {
    refresh,
    get
  };
});

export const useEmployeeStatisticsStore = defineStore('employeeStatisticsStore', () => {
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
      console.log(stats.value);
    } catch {
      // TODO error handling
      console.error('something bad happened');
    }
  };

  const get = (): EmployeeStatistic[] | undefined => {
    return stats.value;
  };

  watch(
    () => dateRangeStore.dateRange,
    (newValue) => {
      if ((newValue && newValue[1] !== null) || newValue === null) {
        refresh();
      }
    }
  );

  watch(employeeId, () => {
    if (employeeId.value) {
      refresh();
    }
  });

  return {
    refresh,
    get,
    employeeId
  };
});

export const useDateRangeStore = defineStore('dateRangeStore', () => {
  const WEEK_DATERANGE = [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()];

  const dateRange = ref<Date[] | null>(WEEK_DATERANGE);

  const reset = () => {
    dateRange.value = WEEK_DATERANGE;
  };

  return { dateRange, reset };
});

export const useAuthStore = defineStore('authStore', () => {
  const role = ref<Role | undefined>(undefined);
  const employeeId = ref<number>(-1);

  const isAuthenticated = computed(() => {
    return role.value !== undefined;
  });

  const authenticate = (r: Role, empId: number) => {
    role.value = r;
    employeeId.value = empId;
  };

  const unauthenticate = () => {
    role.value = undefined;
  };

  const getRole = () => {
    return role.value;
  };

  // will probably want to remove this logic eventually
  watch(isAuthenticated, (newValue) => {
    if (newValue) {
      if (role.value === Role.SUPERVISOR) {
        router.push({ name: 'supervisor' });
        return;
      }
      if (role.value === Role.EMPLOYEE) {
        router.push({ name: 'employee' });
        return;
      }
      router.push({ name: 'home' });
    } else {
      router.push({ name: 'login' });
    }
  });

  return {
    isAuthenticated,
    authenticate,
    unauthenticate,
    getRole,
    employeeId
  };
});
