<template>
    <div class="flex items-center justify-center h-screen">
      <card>
        <template #title>Title</template>
        <template #content>
          <div class="flex gap-3">
            <prime-button type="button" label="The Fun Button" @click="click()" />
          </div>
        </template>
      </card>
    </div>
  </template>
  
  <script setup lang="ts">
  import Card from 'primevue/card';
  import PrimeButton from 'primevue/button';
  import router from '@/router';
  // Component Info (props/emits) -------------------------------------------------------
  
  // Template Refs  ---------------------------------------------------------------------
  
  // Variables --------------------------------------------------------------------------
  
  // Reactive Variables -----------------------------------------------------------------
  
  // Provided ---------------------------------------------------------------------------
  
  // Exposed ----------------------------------------------------------------------------
  
  // Injections -------------------------------------------------------------------------
  
  // Watchers ---------------------------------------------------------------------------
  
  // Methods ----------------------------------------------------------------------------
  const click = () => {
    router.push({ name: 'login' });
  };
  
  // Lifecycle Hooks --------------------------------------------------------------------
  </script>
  