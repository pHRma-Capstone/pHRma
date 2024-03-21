<template>
  <data-table
    class="w-full"
    :value="sortedData"
    sort-field="day"
    :sort-order="-1"
    paginator
    :rows="10"
    :rowsPerPageOptions="[10, 25, 50]"
    striped-rows
    scrollable
    removable-sort
  >
    <column field="day" header="Date" sortable>
      <template #body="slotProps">
        {{ formatDate(slotProps.data.day) }}
      </template>
    </column>
    <column v-for="c in columns" :key="c.field" :field="c.field" :header="c.header" sortable />
  </data-table>
</template>

<script setup lang="ts">
import type { ServiceStatistic } from '@/util/types';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed } from 'vue';

const props = defineProps<{
  data: ServiceStatistic[] | undefined;
}>();

const sortedData = computed(() => {
  return [...(props.data ?? [])].sort((a, b) => b.day.getTime() - a.day.getTime());
});

const columns: { field: keyof ServiceStatistic; header: string }[] = [
  { field: 'numberNotes', header: 'Consult Notes' },
  { field: 'numberAbbreviatedNotes', header: 'Abbreviated Notes' },
  { field: 'numberMedications', header: 'Medications' },
  { field: 'averageMedicationsPerConsult', header: 'Avg. Medications per Consult' },
  { field: 'numberInterventions', header: 'Interventions' },
  { field: 'averageTimePerConsult', header: 'Avg. Time per Consult' },
  { field: 'numberRequests', header: 'Requests' },
  { field: 'numberEmergencyRoom', header: 'Emergency Room' },
  { field: 'numberIntensiveCareUnit', header: 'Intensive Care Unit' },
  { field: 'numberProgressiveCareUnit', header: 'Progressive Care Unit' },
  { field: 'numberMissouriPsychiatricCenter', header: 'Missouri Psychiatric Center' },
  { field: 'numberOther', header: 'Other' },
  { field: 'numberReferredToPharmacist', header: 'Referred to Pharmacist' }
];

const formatDate = (value: string) => {
  const date = new Date(value);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  return formattedDate;
};
</script>
