<template>
  <div class="mx-2">
    <h3 class="my-2">Filter: </h3>
      <div class="d-flex " v-for="( filterItem, index ) in filteredCondition" :key="index">
        <div class=" mx-2" style="width: 100px;">
          <v-select :items="linkedMethod" v-model="filterItem.uesdlinkedMethod" v-if="index > 0">
          </v-select>
        </div>
        <v-row>
          <v-col cols="6">
            <v-select v-model="filterItem.selectedItem"
              :items="definedProps.filterItems" label="All Field" solo>
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field label="Enter text" required v-model="filterItem.textContent"></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex align-center">
          <v-btn class="mx-2" fab dark small color="error" @click="removedFilterCondition(index)">
            <v-icon dark> mdi-minus </v-icon>
          </v-btn>
          <v-btn class="mx-2" fab dark small color="primary" @click="addFilterCondition">
            <v-icon dark>
              mdi-plus
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex justify-between mb-2">
        <div class="d-flex align-center">
          <v-btn variant="outlined" color="primary" class="text-none mr-2" @click="filteredConditionTransportDataService()">
          Search
          </v-btn>
          <p>
            <span v-if="displayMeg.message !== ''" class="mr-2">{{ displayMeg.message }}</span>
            <v-progress-circular indeterminate color="primary" v-if="displayMeg.toogleIcon"></v-progress-circular>
          </p>
        </div>
        
        <v-btn class="text-none ml-auto" color="primary" variant="outlined"
          @click="toggledFilterPage">Close</v-btn>
      </div>
    
  </div>
</template>
<script setup>
  import {ref,/* reactive */} from 'vue';
  import { Subject, takeUntil, debounceTime} from 'rxjs';
  // import { timestamp } from 'rxjs/operators';
  const conSubject$ = new Subject();
  import { dataService } from '../../service/dataservice';
  const linkedMethod = ref(['and', 'or']);
  const definedProps = defineProps(['filterItems']);
  const definedEmits = defineEmits(['toggledFilterPage']);
  const filteredCondition = ref([{
    uesdlinkedMethod:'and',
    selectedItem:'',
    textContent:''
  }]);
  const displayMeg = ref({
    toogleIcon:false,
    message:''
  });
  const toggledFilterPage = ()=>definedEmits('toggledFilterPage', false);
  const removedFilterCondition = (index) => {
    if(filteredCondition.value.length > 1){
      filteredCondition.value.splice(index, 1)
    }else{
      filteredCondition.value[0].uesdlinkedMethod = 'and';
      filteredCondition.value[0].selectedItem = '';
      filteredCondition.value[0].textContent = '';
    }
  };
  const addFilterCondition = ()=>{
    filteredCondition.value.push({
      uesdlinkedMethod:'and',
      selectedItem:'',
      textContent:''
    })
  };
  const filteredConditionTransportDataService = () => {
    const conditions = JSON.parse(JSON.stringify(filteredCondition.value));
    displayMeg.value.message = 'data programing';
    displayMeg.value.toogleIcon = true;
    for(let i = conditions.length - 1; i > 0 ; i--){
      if(conditions[i].selectedItem === '' || conditions[i].textContent === ''){
        conditions.splice(i, 1);
      }
    }
    dataService.handleFilterXlsx(conditions)
    // setTimeout(()=> dataService.handleFilterXlsx(conditions),100);
    
  }
  dataService.handleXlsxMessage$.pipe(takeUntil(conSubject$), debounceTime(1000)).subscribe((meg) => {
    displayMeg.value.message = meg.message;
    displayMeg.value.toogleIcon = meg.displayedIcon;
  });
</script>