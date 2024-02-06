import router from '@/router';
import { Role } from '@/util/types';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useStore = defineStore('store', () => {});

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

  watch(isAuthenticated, (newValue) => {
    if (newValue) {
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
