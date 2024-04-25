import { defineStore } from 'pinia';
import type { ToastMessageOptions } from 'primevue/toast';
import { ref } from 'vue';

const useToastStore = defineStore('toastStore', () => {
  const toastMessageOptions = ref<ToastMessageOptions>();

  const add = (options: ToastMessageOptions) => {
    toastMessageOptions.value = options;
  };

  const addError = (detail: string, summary: string = 'Error', life: number = 3000) => {
    toastMessageOptions.value = { severity: 'error', summary: summary, detail: detail, life: life };
  };

  const get = (): ToastMessageOptions | undefined => {
    return toastMessageOptions.value;
  };

  return { add, addError, get };
});

export default useToastStore;
