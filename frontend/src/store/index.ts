import router from '@/router';
import { Role, type ServiceStatistic } from '@/util/types';
import axios, { type AxiosResponse } from 'axios';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useServiceStatisticsStore = defineStore('serviceStatisticsStore', () => {
  const stats = ref<ServiceStatistic[] | undefined>(undefined);

  const refresh = async () => {
    try {
      // TODO replace with actual endpoint
      const res: AxiosResponse<ServiceStatistic[]> = await axios.get('http://localhost:3000/serviceStatistics');
      // convert date to Date object, may not need
      res.data = res.data.map((i) => ({ ...i, day: new Date(i.day) }));
      stats.value = res.data;
    } catch {
      // TODO error handling
      console.error('something bad happened');
    }
  };

  const get = (): ServiceStatistic[] | undefined => {
    return stats.value;
  };

  return {
    refresh,
    get
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
