<template>
  <div>
    <Narbar />
    <div class="mt-2" v-if="sheetsName.length !==0">
      <span class="mx-2">Sheet:</span>
    <span v-for="name in sheetsName" :key="name" @click="selectedSheet(name)">
        <v-btn variant="outlined" class="text-none ml-2 my-1">
          {{ name }}
        </v-btn>
    </span>
  </div>
    <h3 class="my-1 ml-2" v-if="sheetName !== 'null'">{{ sheetName }}</h3>
    <div class="mx-2 mt-1" style="overflow-y:hidden">
      <v-data-table 
        v-model:items-per-page="itemsPerPage"
        :headers="xlsxFileHeader"
        :items="showXlsxFileTalbe"
        item-value="Chr"
        class="elevation-1"
        height="84vh"
      ></v-data-table>
    </div>
  </div>
</template>
<script setup>
  import {ref, reactive} from 'vue';
  import Narbar from './NavBar.vue';
  import { dataService } from '../service/dataservice';
  import { Subject, takeUntil } from 'rxjs';
  import { VDataTable } from 'vuetify/labs/VDataTable';
  const xlsxFileHeader = ref([]);
  const showXlsxFileTalbe = ref([]);
  const comSubject$ = new Subject();
  const itemsPerPage = ref(100);
  const storagedXlsxFile = [];
  const sheetsName = reactive([]);
  const sheetName = ref('null');
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe(async(readXlsxFile)=>{
    console.log(readXlsxFile);
    await displayedXlsxTableData(readXlsxFile.data[0]);
    readXlsxFile.data.forEach((sheet) => {
      storagedXlsxFile.push({
        sheetName:sheet.sheetName,
        sheetData:sheet.sheetData
      });
      sheetsName.push(sheet.sheetName);
    });
  });
  const selectedSheet = (sheetname)=>{
    if(storagedXlsxFile.length === 0) return;
    if(sheetsName.value === sheetname) return;
    storagedXlsxFile.forEach((sheet)=>{
      if(sheet.sheetName === sheetname){
        displayedXlsxTableData(sheet);
        return
      }
    })
  }
  const displayedXlsxTableData = (readXlsxData)=>{
    if(showXlsxFileTalbe.value.length !== 0) showXlsxFileTalbe.value.length = 0;
    sheetName.value = readXlsxData.sheetName;
    const headerKeys = Object.keys(readXlsxData.sheetData[0]);
    for(let i = 0 ; headerKeys.length > i ; i++){
      xlsxFileHeader.value.push({
        title: headerKeys[i],
        key: headerKeys[i],
        align: 'start',
      })
    }
    for(let i = 0 ; readXlsxData.sheetData.length > i ; i++){
      showXlsxFileTalbe.value.push(readXlsxData.sheetData[i]);
      if(i % 1000 === 0)console.log(i);
    }
  }
</script>