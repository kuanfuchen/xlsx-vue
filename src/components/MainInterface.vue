<template>
  <div>
    <Narbar />
    <div class="mt-0" v-if="sheetsName.length !==0">
      <div class="d-flex mb-1" style="align-items: center;">
        <h3 class="ml-5" v-if="sheetName !== 'null'">{{ sheetName }}</h3>
        <span class="ml-auto mr-2" style="font-size: 22px;">Sheet:</span>
        <SheetList class="mr-1 py-1" :propsItems="sheetsName" @toggledProgress="(ev) => toggleProgress = ev"></SheetList>
        <v-btn class="mr-1" icon="mdi-filter-check-outline" @click="toggledFilterPage = true">
      </v-btn>
      </div>
    </div>
    <div class="mx-2 mt-1" style="overflow-y:hidden">
      <v-data-table item-value="Chr" class="elevation-1"
        v-model:items-per-page="itemsPerPage" height="84vh"
        :headers="xlsxFileHeader" :items="showXlsxFileTalbe">
      </v-data-table>
    </div>
    <v-dialog v-model="toggledFilterPage" width="auto" persistent>
      <v-card style="width:80vw">
        <FilterPage :filterItems="xlsxFileHeader" @toggledFilterPage="(ev)=>toggledFilterPage=ev"></FilterPage>
      </v-card>
    </v-dialog>
    <v-dialog v-model="toggleProgress" width="auto" persistent>
      <v-card style="width: 30vw; height: 20vh;" class="justify-center align-center">
        <h1 class="mb-4">Waiting</h1>
        <v-progress-circular
          :size="100"
          :width="12"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-card>
    </v-dialog>
    
  </div>
</template>
<script setup>
  import {ref, reactive} from 'vue';
  import Narbar from './NavBar.vue';
  import { dataService } from '../service/dataservice';
  import { Subject, takeUntil } from 'rxjs';
  import { VDataTable } from 'vuetify/labs/VDataTable';
  import SheetList from './modules/SheetsList.vue';
  import FilterPage from './modules/FilterData.vue';
  const xlsxFileHeader = ref([]);
  const showXlsxFileTalbe = ref([]);
  const comSubject$ = new Subject();
  const itemsPerPage = ref(100);
  const toggleProgress = ref(false);
  const sheetsName = reactive([]);
  const sheetName = ref('null');
  const toggledFilterPage = ref(false);
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe(async(readXlsxFile)=>{
    await displayedXlsxTableData(readXlsxFile.sheetData);
    sheetName.value = readXlsxFile.sheetName;
  });
  dataService.transfetSheetsList$.pipe(takeUntil(comSubject$)).subscribe((sheetsList)=>{
    console.log(sheetsList,'sheetsList')
    if(sheetsName.length > 0) sheetsName.length = 0;
    for(let i = 0 ; sheetsList.length > i ; i++){
      sheetsName.push(sheetsList[i]);
    }
  });
  const displayedXlsxTableData = (readXlsxData) => {
    if(showXlsxFileTalbe.value.length !== 0) showXlsxFileTalbe.value.length = 0;
    const headerKeys = Object.keys(readXlsxData[0]);
    for(let i = 0 ; headerKeys.length > i ; i++){
      xlsxFileHeader.value.push({
        title: headerKeys[i],
        key: headerKeys[i],
        align: 'start',
      })
    }
    for(let i = 0 ; readXlsxData.length > i ; i++){
      showXlsxFileTalbe.value.push(readXlsxData[i]);
      if(i % 1000 === 0)console.log(i);
    }
    toggleProgress.value = false;
  }
</script>