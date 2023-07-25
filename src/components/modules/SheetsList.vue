<template>
    <v-col cols="12" sm="2">
      <v-select dense outlined :hide-details="true"
        :items="definedProp.propsItems" v-model="selectedItem"
        label="Select sheet" @update:modelValue="clickedItem">
      </v-select>
    </v-col>
</template>
<script setup>
  import {ref, onMounted} from 'vue';
  import { dataService } from '../../service/dataservice.js';
  const definedProp = defineProps(['propsItems']);
  // const definedEmit  = defineEmits(['selectItem']);
  const selectedItem = ref('');
  const clickedItem = (sheetName)=>{
    console.log(sheetName,'sheetName')
    selectedItem.value = sheetName;
    // definedEmit('selectItem',item)
    dataService.changedSheetData(sheetName)
  }
  onMounted(() => {
    selectedItem.value = definedProp.propsItems[0];
  });
</script>