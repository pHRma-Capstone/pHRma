import router from '@/router';
import { Role } from '@/util/types';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

const useAuthStore = defineStore('authStore', () => {
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

export default useAuthStore;
