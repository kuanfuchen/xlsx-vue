<template>
  <div>
    <Narbar />
    <div class="mx-2 mt-1" style="overflow-y:hidden">
      <v-data-table 
        v-model:items-per-page="itemsPerPage"
        :headers="headerXlsx"
        :items="dataXlsx"
        item-value="Chr"
        class="elevation-1"
        height="89vh"
      ></v-data-table>
    </div>
  </div>
</template>
<script setup>
  import {ref,/* reactive */} from 'vue';
  import Narbar from './NavBar.vue';
  import { dataService } from '../service/dataservice';
  import { Subject, takeUntil } from 'rxjs';
  import { VDataTable } from 'vuetify/labs/VDataTable';
  const headerXlsx = ref([]);
  const dataXlsx = ref([]);
  const comSubject$ = new Subject();
  const itemsPerPage = ref(100);
  
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe(async(xlsxData)=>{
    console.log(xlsxData);
    await combinedTableInfo(xlsxData);
    // const table = await combinedTableInfo(xlsxData);
    // headerXlsx.value = table.headers;
    // dataXlsx.value = table.tableContent;
  })
  const combinedTableInfo = (xlsxData)=>{
    const headerKeys = Object.keys(xlsxData.data[0]);
    for(let i = 0 ; headerKeys.length > i ; i++){
      headerXlsx.value.push({
        title: headerKeys[i],
        key: headerKeys[i],
        align: 'start',
      })
    }
    for(let i = 0 ; xlsxData.data.length > i ; i++){
      dataXlsx.value.push(xlsxData.data[i]);
      if(i % 1000 === 0)console.log(i);
    }
    // return {headers, tableContent};
  }
  
</script>