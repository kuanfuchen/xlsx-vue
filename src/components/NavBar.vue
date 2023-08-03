<template>
  <v-card>
    <v-app-bar prominent color="primary">
      <v-toolbar-title>Read Xlsx</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <ExportFile /> -->
      <v-btn variant="text" class="text-none" @click="toggledExportFile = true"
        icon="mdi-download">
      </v-btn>
      <v-btn variant="text" icon="mdi-file-upload" 
        @click="toogledImportFile = !toogledImportFile">
      </v-btn>
      <!-- <v-btn variant="text" icon="mdi-cog-box"></v-btn> -->
      <Setting></Setting>
      <!-- <v-app-bar-nav-icon icon="mdi-cog-box" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
    </v-app-bar>
    <!-- <v-navigation-drawer v-model="drawer" location="bottom" temporary>
      <v-list :items="items"></v-list>
    </v-navigation-drawer> -->
    <v-dialog v-model="toogledImportFile" width="auto" persistent>
      <v-card>
        <v-card-title>
          Import XLSX
        </v-card-title>
        <!-- <FileManagenment @toogledImportFilePage="(isToggled) => toogledImportFile=isToggled"></FileManagenment> -->
        <ImportData style="width:60vw ; height:200px" :existXlsx="importFinishXlsx" @toggledImportPage="(isToggled) => toogledImportFile=isToggled"></ImportData>
      </v-card>
    </v-dialog>
    <v-dialog v-model="toggledExportFile" width="auto">
      <v-card style="width:50vw ; ">
        <v-card-title>
          Export XLSX
        </v-card-title>
        <ExportFile  @toggledExportPage="(ev) => toggledExportFile = ev"></ExportFile>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script setup>
  import { ref, /* reactive */} from 'vue';
  import { dataService } from '@/service/dataservice';
  import { takeUntil,Subject } from 'rxjs';
  import ExportFile from './fileManagerment/ExportData.vue';
  import Setting from './modules/Setting.vue';
  const comsubject$ = new Subject();
  const toogledImportFile = ref(true);
  const toggledExportFile = ref(false);
  const importFinishXlsx = ref(false);
  import ImportData from './fileManagerment/ImportData.vue'; 
  // import ExportFile from './fileManagerment/ExportData.vue';
  // const group = ref(null);
  dataService.lockedInterface$.pipe(takeUntil(comsubject$)).subscribe((interfaceLocked) => {
    if(interfaceLocked === false) {
      toogledImportFile.value = false;
      importFinishXlsx.value = true;
    }
  });
</script>