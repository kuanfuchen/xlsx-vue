<template>
  <div>
    <h4 class="ml-5">SheetName</h4>
    <div class="">
      <ul class="">
        <li v-for="sheet in sheetsList" :key="sheet">
          <div >
            <v-checkbox v-model="sheet.selected" :label="sheet.name" :dense="true" :hide-details="true"></v-checkbox>
            <!-- <span>{{ sheet.name }}</span>
            <span></span> -->
          </div>
        </li>
      </ul>
    </div>
    <div class="mt-2 d-flex mb-2">
      <div class="mx-auto">
        <v-btn variant="outlined" class="mr-2 text-none" @click="exportXlsx">Download</v-btn>
        <v-btn variant="outlined" class="text-none" @click="closedExportPage">Cancel</v-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import { takeUntil, Subject } from 'rxjs';
import { ref, reactive, onMounted } from 'vue';
import { dataService } from '../../service/dataservice';
const comSubject$ = new Subject();
const definedEmit = defineEmits(['toggledExportPage']);
const downloadFileDialog = ref(false);
const sheetsList = reactive([]);
dataService.exportFileProgram$.pipe(takeUntil(comSubject$)).subscribe((program)=>{
  downloadFileDialog.value = program.download;
});
const closedExportPage = ()=> definedEmit('toggledExportPage', false);
const exportXlsx = ()=> {
  const exportSheetsList = JSON.parse(JSON.stringify(sheetsList));
  dataService.exportXlsx(exportSheetsList);
};
onMounted(async() => {
  const dataSheetsList = await dataService.transferSheetsList();
  for(let i = 0 ; dataSheetsList.length > i ; i++){
    sheetsList.push({
      name:dataSheetsList[i],
      selected:true
    })
  }
})
// dataService.transfetSheetsList$.pipe(takeUntil(comSubject$)).subscribe((sheetsNameList)=>{
//   console.log(sheetsNameList,'sheetsNameList')
//   if(sheetsList.value.length > 0) sheetsList.value.length = 0;
//   sheetsList.value = sheetsNameList;
// });
</script>