<template>
  <div>
    <Narbar />
    <v-data-table
      v-model:items-per-page="itemsPerPage"
      :headers="headerXlsx"
      :items="dataXlsx"
      item-value="#CHROM"
      class="elevation-1"
    ></v-data-table>
    <!-- <div class="" > -->
      <!-- <v-table >
        <thead>
          <tr >
            <th v-for="title in headerXlsx" :key="title">{{ title }}</th>
          </tr>
          
        </thead>
        <tbody >
          <tr v-for="(items, index) in dataXlsx" :key="index">
            <td v-for="item in items" :key="item">{{ item }}</td>
          </tr>
        </tbody>
      </v-table> -->
    <!-- </div> -->

  </div>
</template>
<script setup>
  import {ref, reactive} from 'vue';
  import Narbar from './NavBar.vue';
  import { dataService } from '../service/dataservice';
  import { Subject, takeUntil } from 'rxjs';
  const headerXlsx = ref([]);
  const dataXlsx = reactive([]);
  const comSubject$ = new Subject();
  const itemsPerPage = ref(20);
  dataService.transferTableInfo$.pipe(takeUntil(comSubject$)).subscribe((xlsxData)=>{
    console.log(xlsxData)
    const header = Object.keys(xlsxData.data);
    //  headerXlsx.value
    for(let i = 0 ; xlsxData.data.length > i ; i++){
      dataXlsx.push(xlsxData.data[i])
    }
  })
  
  
</script>