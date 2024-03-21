<template>
  <div class="p-3 flex flex-col h-full">
    <!-- title/edit button -->
    <prime-button @click="visible = true" :label="`${selectedCalc.name} ${selectedStat.name}`" text icon="pi pi-pencil" icon-pos="right" plain />

    <!-- main content -->
    <div class="flex flex-auto items-center justify-center">
      <p class="text-5xl pb-2">{{ stat }}</p>
    </div>
  </div>

  <!-- stat selection modal -->
  <prime-dialog v-model:visible="visible" modal header="Edit Statistic" draggable close-on-escape dismissable-mask @hide="hide">
    <div class="flex gap-3">
      <div class="flex flex-col gap-2">
        <label for="calculation">Calculation</label>
        <prime-dropdown id="calculation" v-model="dropdownSelectedCalc" :options="dropdownSelectedCalculationOptions" option-label="name" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="stat">Statistic</label>
        <prime-dropdown id="stat" v-model="dropdownSelectedStat" :options="dropdownSelectedStatOptions" option-label="name" />
      </div>
    </div>

    <template #footer>
      <prime-button severity="secondary" label="Cancel" class="h-10" @click="visible = false" />
      <prime-button
        severity="primary"
        label="Save"
        class="h-10"
        @click="
          () => {
            wasSavePressed = true;
            visible = false;
          }
        "
      />
    </template>
  </prime-dialog>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button';
import PrimeDropdown from 'primevue/dropdown';
import PrimeDialog from 'primevue/dialog';
import { Calculation, type SelectableServiceStatistic, type ServiceStatistic } from '@/util/types';
import { ref, watch } from 'vue';

const props = defineProps<{
  data: ServiceStatistic[] | undefined;
}>();

const dropdownSelectedCalculationOptions: { name: string; value: Calculation }[] = [
  { name: 'Average', value: Calculation.AVG },
  { name: 'Median', value: Calculation.MEDIAN },
  { name: 'Maximum', value: Calculation.MAX },
  { name: 'Minimum', value: Calculation.MIN }
];

const dropdownSelectedStatOptions: { name: string; value: SelectableServiceStatistic }[] = [
  { name: 'Consult Notes', value: 'numberConsultNotes' },
  { name: 'Abbreviated Notes', value: 'numberAbbreviatedNotes' },
  { name: 'Medications', value: 'numberMedications' },
  { name: 'Interventions', value: 'numberInterventions' },
  { name: 'Interventions per Consult', value: 'averageInterventionsPerConsult' },
  { name: 'Time per Consult', value: 'averageTimePerConsult' },
  { name: 'Requests', value: 'numberRequests' }
];

const dropdownSelectedCalc = ref({ name: 'Average', value: Calculation.AVG });
const dropdownSelectedStat = ref<{ name: string; value: SelectableServiceStatistic }>({ name: 'Consult Notes', value: 'numberConsultNotes' });

const selectedCalc = ref({ name: 'Average', value: Calculation.AVG });
const selectedStat = ref<{ name: string; value: SelectableServiceStatistic }>({ name: 'Consult Notes', value: 'numberConsultNotes' });

const visible = ref(false);
const stat = ref();
const wasSavePressed = ref(false);

const hide = () => {
  if (wasSavePressed.value) {
    selectedCalc.value = dropdownSelectedCalc.value;
    selectedStat.value = dropdownSelectedStat.value;
    wasSavePressed.value = false;
  } else {
    dropdownSelectedCalc.value = selectedCalc.value;
    dropdownSelectedStat.value = selectedStat.value;
  }
};

const calculate = () => {
  if (!props.data) {
    console.error('uh oh');
    return;
  }
  let nums = props.data.map((s) => s[selectedStat.value.value]);

  switch (selectedCalc.value.value) {
    case Calculation.AVG:
      stat.value = Math.floor(nums.reduce((a, b) => a + b) / nums.length);
      break;
    case Calculation.MEDIAN:
      nums = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(nums.length / 2);
      stat.value = nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      break;
    case Calculation.MAX:
      stat.value = Math.max(...nums);
      break;
    case Calculation.MIN:
      stat.value = Math.min(...nums);
      break;
  }
};

watch([() => props.data, () => selectedCalc.value, () => selectedStat.value], calculate);
</script>

<style></style>
