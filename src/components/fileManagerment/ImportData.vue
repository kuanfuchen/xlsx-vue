<template>
  <div class="mt-3 mx-2">
    <v-file-input label="Excel input" variant="outlined"
      accept=".xlsx, .xls" @change="inputXlsxFile($event)"
    ></v-file-input>
    <v-btn variant="outlined" class="text-none" @click="importedXlsxData" :disabled="importXLSXlocked">
      import
    </v-btn>
  </div>
</template>
<script setup>
  import {ref} from 'vue';
  import { dataService } from '../../service/dataservice';
  import { takeUntil } from 'rxjs';
  import {Subject} from 'rxjs';
  const comSubject$ = new Subject([]);
  const xlsxFile = ref(null);
  const importXLSXlocked = ref(false);
  const inputXlsxFile = (ev)=>{
    if( ev.target.files.length === 0 || ev.target.files[0].name === '') return;
    xlsxFile.value =  ev.target.files[0];
  } 
  const importedXlsxData = async() => {
    const xlsxFileValue = xlsxFile.value;
    importXLSXlocked.value = true;
    dataService.handledXlsxFormat(xlsxFileValue);
  }
  dataService.lockedInterface$.pipe(takeUntil(comSubject$)).subscribe((interfaceLocked)=>{
    importXLSXlocked.value = interfaceLocked;
  })
</script>