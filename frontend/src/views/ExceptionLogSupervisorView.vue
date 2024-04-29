<template>
  <div class="flex flex-col justify-center items-center mt-10">
    <prime-card class="w-full p-4">
      <template #title>Exception Requests</template>
      <template #content>
        <div v-for="request in requests" :key="request.id">
          <p>{{ request.text }}</p>
          <button @click="acceptRequest(request.id)">Accept</button>
          <button @click="declineRequest(request.id)">Decline</button>
        </div>
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
const requests: string[] = [];  // probably not a string, but some object with id and text properties - GET from api
// Reactive Variables -----------------------------------------------------------------

// Provided ---------------------------------------------------------------------------

// Exposed ----------------------------------------------------------------------------

// Injections -------------------------------------------------------------------------

// Watchers ---------------------------------------------------------------------------

// Methods ----------------------------------------------------------------------------
const acceptRequest(requestId) {
      // Send PUT(?) request to backend API
}

const declineRequest(requestId) {
      // Send PUT(?) request to backend API
}


// Lifecycle Hooks --------------------------------------------------------------------
</script>