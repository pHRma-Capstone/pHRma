<template>
  <prime-toast />
  <div class="flex items-center justify-center h-screen">
    <card>
      <template #title>Sign In</template>
      <template #content>
        <div class="flex gap-3">
          <div class="flex flex-col">
            <h1 class="text-lg">Employee Login</h1>
            <prime-dropdown :options="dropdownSelectedEmployeeOptions" v-model="dropdownSelectedEmployee" option-label="name" option-value="value" />
            <prime-button type="button" label="Sign In" @click="click(Role.EMPLOYEE)" class="mt-2 w-fit ml-auto" />
          </div>
          <prime-divider layout="vertical" />
          <div class="flex flex-col">
            <h1 class="text-lg">Supervisor Login</h1>
            <prime-dropdown
              :options="dropdownSelectedSupervisorOptions"
              v-model="dropdownSelectedSupervisor"
              option-label="name"
              option-value="value"
            />
            <prime-button type="button" label="Sign In" @click="click(Role.SUPERVISOR)" class="mt-2 w-fit ml-auto" />
          </div>
        </div>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import PrimeDropdown from 'primevue/dropdown';
import PrimeButton from 'primevue/button';
import PrimeDivider from 'primevue/divider';
import { Role, type Employee } from '@/util/types';
import useAuthStore from '@/store/authStore';
import useEmployeeStatisticsStore from '@/store/employeeStatisticsStore';
import router from '@/router';
import { onMounted, ref } from 'vue';
import api from '@/util/api';
import type { AxiosResponse } from 'axios';
import { useToast } from 'primevue/usetoast';
import PrimeToast from 'primevue/toast';

// Component Info (props/emits) -------------------------------------------------------

// Template Refs  ---------------------------------------------------------------------

// Variables --------------------------------------------------------------------------

// Reactive Variables -----------------------------------------------------------------
const dropdownSelectedEmployeeOptions = ref<{ name: string; value: number }[]>([]);
const dropdownSelectedEmployee = ref<number>(1);

const dropdownSelectedSupervisorOptions = ref<{ name: string; value: number }[]>([]);
const dropdownSelectedSupervisor = ref<number>(1);

const toast = useToast();
// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------

// Methods ----------------------------------------------------------------------------
const click = (role: Role) => {
  useAuthStore().authenticate(role, role == Role.EMPLOYEE ? dropdownSelectedEmployee.value : dropdownSelectedSupervisor.value);
  if (role == Role.EMPLOYEE) {
    useEmployeeStatisticsStore().employeeId = dropdownSelectedEmployee.value;
  }
  router.push({ name: 'home' });
};

// Lifecycle Hooks --------------------------------------------------------------------
onMounted(() => {
  api
    .get('/employees')
    .then((res: AxiosResponse<Employee[]>) => {
      dropdownSelectedSupervisorOptions.value = res.data
        .filter((v) => v.isPharmacist)
        .map((v) => {
          return { name: `${v.firstName} ${v.lastName}`, value: v.id };
        });

      dropdownSelectedSupervisor.value = dropdownSelectedSupervisorOptions.value[0].value;

      dropdownSelectedEmployeeOptions.value = res.data
        .filter((v) => !v.isPharmacist)
        .map((v) => {
          return { name: `${v.firstName} ${v.lastName}`, value: v.id };
        });

      dropdownSelectedEmployee.value = dropdownSelectedEmployeeOptions.value[1].value;
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: 'Error', detail: 'There was an error fetching employees', life: 3000 });
    });
});
</script>
