<template>
    <div class="flex flex-col justify-center items-center mt-10">
      <prime-card class="w-1/2 p-4">
        <template #title>Exception Logging</template>
        <template #content>
          <form @submit.prevent="handleSubmit" class="h-full w-full">
            <textarea v-model="textInput" class="my-4 mr-4 w-full h-64 px-2 py-2" placeholder="Start here:"></textarea>
            <prime-button class="flex items-center justify-center" type="submit" label="Submit" @click="handleSubmit()" />
          </form>
        </template>
      </prime-card>
    </div>

    <div class="flex flex-col justify-center items-center mt-10">
    <prime-card class="w-full p-4">
      <template #title>Your Exception Requests</template>
      <template #content>
        <div>foo</div>
      </template>
    </prime-card>
  </div>
  </template>

  <script setup lang="ts">
  import PrimeButton from 'primevue/button';
  import PrimeCard from 'primevue/card';
  import router from '@/router';
  import { ref } from 'vue';
  // Component Info (props/emits) -------------------------------------------------------
  
  // Template Refs  ---------------------------------------------------------------------
  
  // Variables --------------------------------------------------------------------------
  const textInput = ref<string>('');
  // Reactive Variables -----------------------------------------------------------------
  
  // Provided ---------------------------------------------------------------------------
  
  // Exposed ----------------------------------------------------------------------------
  
  // Injections -------------------------------------------------------------------------
  
  // Watchers ---------------------------------------------------------------------------
  
  // Methods ----------------------------------------------------------------------------

  const handleSubmit = () => {
    console.log("Submitted text:", textInput.value);  // replace with backend api POST request
  }
  
  
  // Lifecycle Hooks --------------------------------------------------------------------
  </script>
  