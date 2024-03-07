import router from '@/router';
import { Role, type ServiceStatistic } from '@/util/types';
import axios, { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useServiceStatisticsStore = defineStore('serviceStatisticsStore', () => {
  const stats = ref<ServiceStatistic[] | undefined>(undefined);
  const dateRange = ref<Date[] | null>([new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()]);

  const getParams = () => {
    if (!dateRange.value) {
      return {};
    } else if (dateRange.value[1] === null) {
      return { endDate: dateRange.value[0].toISOString().split('T')[0] };
    } else {
      return { startDate: dateRange.value[0].toISOString().split('T')[0], endDate: dateRange.value[1].toISOString().split('T')[0] };
    }
  };

  const refresh = async () => {
    try {
      const params = getParams();
      const res: AxiosResponse<ServiceStatistic[]> = await axios.get('http://localhost:3000/api/service-statistics', { params });
      // convert date to Date object, may not need
      res.data = res.data.map((i) => ({ ...i, day: new Date(`${i.day}T00:00`) }));
      stats.value = res.data;
    } catch {
      // TODO error handling
      console.error('something bad happened');
    }
  };

  watch(
    dateRange,
    () => {
      if ((dateRange.value && dateRange.value[1] !== null) || dateRange.value === null) {
        refresh();
      }
    },
    { immediate: true }
  );

  const get = (): ServiceStatistic[] | undefined => {
    return stats.value;
  };

  return {
    refresh,
    get,
    dateRange
  };
});

// TODO remake when backend auth is set up
export const useAuthStore = defineStore('authStore', () => {
  // Retrieve the role from local storage if it exists, otherwise set it to undefined
  const storedRole = localStorage.getItem('role');
  const role = ref<Role | undefined>(storedRole ? JSON.parse(storedRole) : undefined);

  const isAuthenticated = computed(() => {
    return role.value !== undefined;
  });

  const authenticate = (r: Role) => {
    role.value = r;
    localStorage.setItem('role', JSON.stringify(r));
  };

  const unauthenticate = () => {
    role.value = undefined;
    localStorage.removeItem('role');
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
      router.push({ name: 'home' });
    } else {
      router.push({ name: 'login' });
    }
  });

  return {
    isAuthenticated,
    authenticate,
    unauthenticate,
    getRole
  };
});
