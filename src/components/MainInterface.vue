<template>
  <div>
    <Narbar />
    <div class="mt-0" v-if="sheetsName.length !==0">
      <div class="d-flex mb-1" style="align-items: center;">
        <!-- <h3 class="ml-5" v-if="sheetName !== 'null'">{{ sheetName }}</h3> -->
        <!-- <span class="ml-auto mr-2" style="font-size: 22px;">Sheet:</span> -->
        <SheetList class="mr-1 py-1" :propsItems="sheetsName" @toggledProgress="(ev) => toggleProgress = ev"></SheetList>
        <div class="ml-auto mr-5">
          <input type="text" v-model="searchText" class="px-1 py-1" style="border: 1px solid black;border-radius:3px 0 0 3px;" placeholder="search">
          <button style="border: 1px solid black;" class="px-2 py-1" @click="searchFun">
            <span class="mdi mdi-magnify"></span>
          </button>
            
        </div>
        <v-btn class="mr-1" icon="mdi-filter-check-outline" @click="toggledFilterPage = true"></v-btn>
        <!-- <div class="mr-5 d-flex " style="align-items: center;justify-content: space-between;">
          
        </div> -->
      </div>
    </div>
    <div class="mx-2 mt-1">
      <!-- style="height: 84vh;" -->
      <v-data-table item-value="Chr" class="elevation-1"
        v-model:items-per-page="itemsPerPage" height="84vh"
        :headers="xlsxFileHeader" :items="showXlsxFileTalbe">
      </v-data-table>
    </div>
    <v-dialog v-model="toggledFilterPage" width="auto">
      <v-card style="width:80vw">
        <FilterPage :filterItems="xlsxFileHeader" @toggledFilterPage="(ev)=>toggledFilterPage=ev"></FilterPage>
      </v-card>
    </v-dialog>
    <v-dialog v-model="toggleProgress" width="auto" persistent>
      <v-card style="width: 30vw; height: 20vh;" class="justify-center align-center">
        <h1 class="mb-4">Waiting</h1>
        <v-progress-circular color="primary" indeterminate :size="100" :width="12"></v-progress-circular>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
  import {ref, reactive} from 'vue';
  import Narbar from './NavBar.vue';
  import { dataService } from '../service/dataservice';
  import { Subject, takeUntil } from 'rxjs';
  // import DataTable from 'datatables.net-vue3';
  // import DataTablesCore from 'datatables.net';
  // DataTable.use(DataTablesCore);
  import { VDataTable } from 'vuetify/labs/VDataTable';
  import SheetList from './modules/SheetsList.vue';
  import FilterPage from './modules/FilterData.vue';
  const xlsxFileHeader = ref([]);
  const showXlsxFileTalbe = ref([]);
  const comSubject$ = new Subject();
  const itemsPerPage = ref(50);
  const toggleProgress = ref(false);
  const sheetsName = reactive([]);
  const sheetName = ref('null');
  const toggledFilterPage = ref(false);
  const searchText = ref('');
  // import SvgIcon from '@jamescoyle/vue-icon';
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe(async(readXlsxFile)=>{
    await displayedXlsxTableData(readXlsxFile.sheetData);
    sheetName.value = readXlsxFile.sheetName;
  });
  dataService.transfetSheetsList$.pipe(takeUntil(comSubject$)).subscribe((sheetsList)=>{
    if(sheetsName.length > 0) sheetsName.length = 0;
    for(let i = 0 ; sheetsList.length > i ; i++){
      sheetsName.push(sheetsList[i]);
    }
  });
  const displayedXlsxTableData = (readXlsxData) => {
    if(showXlsxFileTalbe.value.length !== 0) showXlsxFileTalbe.value.length = 0;
    const headerKeys = Object.keys(readXlsxData[0]);
    const fileHeader = [];
    const fileTableContent = [];
    for(let i = 0 ; headerKeys.length > i ; i++){
      fileHeader.push({
        title: headerKeys[i],
        key: headerKeys[i],
        align: 'start',
      })
    }
    for(let i = 0 ; readXlsxData.length > i ; i++){
      fileTableContent.push(readXlsxData[i]);
      if(i % 1000 === 0)console.log(i);
    }
    xlsxFileHeader.value = fileHeader;
    showXlsxFileTalbe.value = fileTableContent;
    toggleProgress.value = false;
    // console.log(fileTableContent, 'fileTableContent');
    // console.log(fileHeader, 'fileHeader')
    // console.log(fileTableContent, 'fileTableContent')
  }
  const searchFun = ()=>{
    console.log(searchText.value)
  }
</script>