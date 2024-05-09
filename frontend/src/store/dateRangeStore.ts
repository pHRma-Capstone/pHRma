import { defineStore } from 'pinia';
import { ref } from 'vue';

const useDateRangeStore = defineStore('dateRangeStore', () => {
  const WEEK_DATERANGE = [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()];

  const dateRange = ref<Date[] | null>(WEEK_DATERANGE);

  const reset = () => {
    dateRange.value = WEEK_DATERANGE;
  };

  return { dateRange, reset };
});

export default useDateRangeStore;
