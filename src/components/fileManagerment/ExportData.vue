<template>
  <div>
    <v-btn variant="text" class="text-none" @click="downloadFileDialog = true"
      icon="mdi-download">
    </v-btn>
    <v-dialog v-model="downloadFileDialog" transition="dialog-top-transition"
        width="auto">
      <v-card>
        <v-card-title>
          Export Xlsx
        </v-card-title>
        <v-card-action class="justify-center mx-2 my-2">
          <v-btn variant="outlined" class="mr-2 text-none" @click="exportXlsx">Download</v-btn>
          <v-btn variant="outlined" class="text-none" @click="downloadFileDialog = false">Cancel</v-btn>
        </v-card-action>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { takeUntil, Subject } from 'rxjs';
import { ref } from 'vue';
import { dataService } from '../../service/dataservice';
const comSubject$ = new Subject();
const downloadFileDialog = ref(false);
dataService.exportFileProgram$.pipe(takeUntil(comSubject$)).subscribe((program)=>{
  downloadFileDialog.value = program.download;
});
const exportXlsx = ()=> {
  dataService.exportXlsx()
};
</script>