<template>
  <div class="mt-3 mx-2">
    <v-file-input label="Excel input" variant="outlined"
      accept=".xlsx" @change="inputXlsxFile($event)"
    ></v-file-input>
    <v-btn variant="outlined" class="text-none" @click="uploadXlsx">
      Upload
    </v-btn>
  </div>
</template>
<script setup>
  import {ref} from 'vue';
  import { dataService } from '../../service/dataservice';
  // import {Subject, Observable} from 'rxjs';
  // const comSubject$ = new Subject([]);
  const inputFile = ref(null);
  const inputXlsxFile = (ev)=>{
    if( ev.target.files.length === 0 || ev.target.files[0].name === '') return;
    inputFile.value =  ev.target.files[0];
  } 
  const uploadXlsx = async() => {
    const inputVal = inputFile.value
    dataService.handledXlsxFormat(inputVal);
  }
</script>