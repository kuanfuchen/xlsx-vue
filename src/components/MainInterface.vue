<template>
  <div>
    <Narbar />
    <div class="mt-0" v-if="sheetsName.length !==0">
      <div class="d-flex mb-1" style="align-items: center;">
        <SheetList class="mr-1 py-1" :propsItems="sheetsName" @toggledProgress="(ev) => toggleProgress = ev"></SheetList>
        <div class="ml-auto mr-5">
          <span class="mr-2 text-primary" >{{ displaySearchMessage.message }}</span>
          <input type="text" v-model="searchText" class="px-1 py-1" style="border: 1px solid black;border-radius:3px 0 0 3px;" placeholder="search" @keyup.enter="searchFun" >
          <button style="border: 1px solid black;" class="px-2 py-1" @click="searchFun">
            <span class="mdi mdi-magnify"></span>
          </button>
        </div>
        <v-btn class="mr-1" icon="mdi-filter-check-outline" @click="toggledFilterPage = true"></v-btn>
      </div>
    </div>
    <div class="mx-2 mt-1">
      <!-- style="height: 84vh;" -->
      <v-data-table item-value="Chr" class="elevation-1"
        v-model:items-per-page="itemsPerPage" height="86vh"
        :headers="xlsxFileHeader" :items="showXlsxFileTalbe">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
          <tr>
            <template v-for="column in columns" :key="column">
              <td >
                <!-- <span>{{ col.key }}</span> -->
                <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                <template v-if="isSorted(column)">
                  <v-icon :icon="getSortIcon(column)"></v-icon>
                </template>
                <!-- <v-icon icon="$close" @click="removeColumn(column.key)"></v-icon> -->
              </td>
            </template>
            
          </tr>
        </template>
        <template v-slot:item="{item}">
          <tr>
            <td v-for="(value, key, index) in item.columns" :key="key">
              <span>
                {{ value }}
              </span>
              
            </td>
          </tr>
        </template>
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
  import { Subject, takeUntil, debounceTime } from 'rxjs';
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
  const fileHeader = [];
  const displaySearchMessage = ref({});
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe(async(readXlsxFile)=>{
    await displayedXlsxTableData(readXlsxFile.sheetData);
    if(sheetName.value !== readXlsxFile.sheetName){
      sheetName.value = readXlsxFile.sheetName;
      searchText.value = '';
    }
    
  });
  dataService.transfetSheetsList$.pipe(takeUntil(comSubject$)).subscribe((sheetsList)=>{
    if(sheetsName.length > 0) sheetsName.length = 0;
    for(let i = 0 ; sheetsList.length > i ; i++){
      sheetsName.push(sheetsList[i]);
    }
  });
  const displayedXlsxTableData = (readXlsxData) => {
    if(showXlsxFileTalbe.value.length !== 0) showXlsxFileTalbe.value.length = 0;
    if(fileHeader.length > 0) {
      fileHeader.length = 0;
      xlsxFileHeader.value.length = 0;
    }
    const headerKeys = Object.keys(readXlsxData[0]);
    const fileTableContent = [];
    for(let i = 0 ; headerKeys.length > i ; i++){
      const headerInfo = {
        title: headerKeys[i],
        key: headerKeys[i],
        align: 'start',
        index: i
      }
      fileHeader.push(headerInfo);
      xlsxFileHeader.value.push(headerInfo);
    }
    for(let i = 0 ; readXlsxData.length > i ; i++){
      fileTableContent.push(readXlsxData[i]);
      if(i % 1000 === 0)console.log(i);
    }
    showXlsxFileTalbe.value = fileTableContent;
    toggleProgress.value = false;
  }
  const searchFun = ()=>{
    const filterText = JSON.parse(JSON.stringify(searchText.value));
    dataService.searchAllXlsxData(filterText);
  };
  dataService.toggleHeaderSetting$.pipe(takeUntil(comSubject$)).subscribe((header)=>{
    removeColumn(header)
  });
  const removeColumn = (key) => {
    const removeIndex = xlsxFileHeader.value.findIndex((header)=>header.key === key.title);
    if(removeIndex > -1) {
      xlsxFileHeader.value.splice(removeIndex , 1);
    }else{
      const addHeaderIndex = fileHeader.findIndex((header)=>header.key === key.title);
      if(addHeaderIndex > -1){
        const header = {
          align:'start',
          index:addHeaderIndex,
          key:key.title,
          title:key.title,
        }
        xlsxFileHeader.value.splice(addHeaderIndex, 0, header);
        xlsxFileHeader.value.sort((a,b) => a.index - b.index)
      }
    }
  }
  dataService.handleXlsxMessage$.pipe(takeUntil(comSubject$), debounceTime(1000)).subscribe((meg) => {
    displaySearchMessage.value.message = meg.message;
    displaySearchMessage.value.toogleIcon = meg.displayedIcon;
    setTimeout(()=> displaySearchMessage.value = {},10000);
  });
</script>