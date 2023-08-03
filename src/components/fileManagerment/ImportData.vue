<template>
  <div class="mt-3 mx-2">
    <v-file-input label="Excel input" variant="outlined"
      accept=".xlsx, .xls" @change="inputXlsxFile($event)"
    ></v-file-input>
    <div class="d-flex justify-between mb-3">
      <div class="">
        <v-btn variant="outlined" class="text-none mr-2" @click="importedXlsxData" :disabled="importXLSXlocked">
        Import
        </v-btn>
        <v-progress-circular indeterminate color="green" v-if="importXLSXlocked"></v-progress-circular>
      </div>
      
      <v-btn class="text-none ml-auto" color="primary" variant="outlined"
        @click="toggledImportPage" :disabled="xlsxInterfaceLock">
        Close
      </v-btn>
    </div>

  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { dataService } from '../../service/dataservice';
  import { takeUntil } from 'rxjs';
  import {Subject} from 'rxjs';
  const definedProps = defineProps(['existXlsx']);
  const comSubject$ = new Subject([]);
  const xlsxFile = ref(null);
  const importXLSXlocked = ref(false);
  const xlsxInterfaceLock = ref(false);
  const definedEmit = defineEmits(['toggledImportPage']);
  const toggledImportPage = ()=> definedEmit('toggledImportPage', false)
  const inputXlsxFile = (ev)=>{
    if( ev.target.files.length === 0 || ev.target.files[0].name === '') return;
    xlsxFile.value =  ev.target.files[0];
  };
  const importedXlsxData = async() => {
    const xlsxFileValue = xlsxFile.value;
    
    // importXLSXlocked.value = false;
    // xlsxInterfaceLock.value = true;
    await dataService.handledXlsxFormat(xlsxFileValue);
    // xlsxInterfaceLock.value=false;
  };
  dataService.lockedInterface$.pipe(takeUntil(comSubject$)).subscribe((interfaceLocked)=>{
    importXLSXlocked.value = interfaceLocked;
    // xlsxInterfaceLock.value = interfaceLocked;
  });
  onMounted(() => {
    xlsxInterfaceLock.value = definedProps.existXlsx === true ? false : true;
  })
</script>