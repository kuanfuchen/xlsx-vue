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
    <div class="my-2 d-flex">
      <div class="d-flex mx-2 ">
        <v-btn variant="outlined" class="text-none" color="primary" @click="exportXlsx" :disabled="exportXlsxLocked">Download</v-btn>
        <v-progress-circular indeterminate color="green" v-if="exportXlsxLocked"></v-progress-circular>
      </div>
        <div class="ml-auto mr-2">
          <v-btn variant="outlined" color="" class="text-none" :disabled="exportXlsxLocked" @click="closedExportPage">Cancel</v-btn>
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
const sheetsList = reactive([]);
const exportXlsxLocked = ref(false);
dataService.exportFileProgram$.pipe(takeUntil(comSubject$)).subscribe((program)=>{
  console.log(program.download, 'program.download')
});
const closedExportPage = ()=> definedEmit('toggledExportPage', false);
const exportXlsx = async()=> {
  exportXlsxLocked.value = true;
  const exportSheetsList = JSON.parse(JSON.stringify(sheetsList));
  await dataService.exportXlsx(exportSheetsList);
  setTimeout(()=>{exportXlsxLocked.value = false},500)
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
</script>