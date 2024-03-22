<template>
  <div class="flex flex-col justify-center items-center mt-10">
    <Card class="w-1/2 p-4">
      <template #title>Upload</template>
      <template #content>
        <div class="flex flex-col items-center gap-6">
          <FileUpload
            ref="fileUpload"
            name="UploadedFile"
            :customUpload="true"
            @uploader="handleUpload"
            accept=".csv">
            <template #empty>
              <div v-if="showSuccessMessage" class="success-message">{{ successMessage }}</div>
            </template>
          </FileUpload>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUpload, { type FileUploadUploaderEvent } from 'primevue/fileupload';
import Card from 'primevue/card';
import api from '@/util/api';

const showSuccessMessage = ref(false);
const successMessage = ref('');

const handleUpload = async (event: FileUploadUploaderEvent) => {
  const uploadedFile: File = Array.isArray(event.files) ? event.files[0] : event.files;

  if (!uploadedFile) {
    console.error('Please select a file before submitting.');
    return;
  }

  const form = new FormData();
  form.append('UploadedFile', uploadedFile);

  api.post('/uploadFile', form)
  .then (res => {
    console.log(res.data)
    successMessage.value = `${res.data}`;
    showSuccessMessage.value = true;
  })
  .catch (err => {
    successMessage.value = `${err}`;
    showSuccessMessage.value = true;
    console.log(err)
    
  })
}

</script>

