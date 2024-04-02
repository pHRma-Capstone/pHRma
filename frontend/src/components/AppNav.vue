<template>
  <prime-menubar :model="items" breakpoint="500px" class="mx-2 mt-2 shadow-md">
    <template #start>
      <div class="flex gap-2 items-center mr-3">
        <img class="h-11 ml-1" :src="MuLogo" />
        <span class="text-3xl ml-2 font-serif text-black merriweather-regular">pHRma</span>
      </div>
    </template>
    <template #end>
      <prime-button type="button" label="Sign Out" icon="pi pi-sign-out" @click="click()" />
    </template>
  </prime-menubar>
</template>

<script setup lang="ts">
import PrimeMenubar from 'primevue/menubar';
import PrimeButton from 'primevue/button';
import { useAuthStore } from '@/store';
import { Role } from '@/util/types';
import MuLogo from '@/assets/mu.png';
import router from '@/router';
import { ref } from 'vue';

const isSupervisor = useAuthStore().getRole();

const items = ref([
  { label: 'Home', icon: 'pi pi-home', command: () => router.push({ name: 'home' }) },
  { label: 'File Upload', icon: 'pi pi-upload', visible: isSupervisor === Role.SUPERVISOR, command: () => {
      // in theory, this logic is unnecessary since only supervisors should be able to see/click the button thanks to the visible property
      if (isSupervisor === Role.SUPERVISOR) {
        router.push({ name: 'upload' });
      } else {
        alert("You do not have the permissions required to access this page. Please log in as an elevated user.");
      }
    } 
  }
]);

const click = () => {
  useAuthStore().unauthenticate();
  router.push({ name: 'login' });
};

</script>

<style>
.merriweather-regular {
  font-family: 'Merriweather', serif;
  font-weight: 400;
  font-style: normal;
}
</style>
