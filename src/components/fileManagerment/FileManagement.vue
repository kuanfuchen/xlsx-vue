<template>
  <div style="width:60vw ; height:200px">
    <!-- <v-tabs v-model="fileTabs" bg-color="cyan-lighten-4" color="indigo">
      <v-tab value="uploadFile" class="text-none" @click="fileTabs = 'uploadFile'">Upload File</v-tab>
      <v-tab value="exportFile" class="text-none" @click="fileTabs = 'exportFile'">Export File</v-tab>
    </v-tabs> -->
    <!-- <v-card-text>
      <v-window v-model="fileTabs">
        <v-window-item value="uploadFile">
          <ImportData />
        </v-window-item>
        <v-window-item value="exportFile">
          <ExportData />
        </v-window-item>
      </v-window>
      
    </v-card-text> -->
    <ImportData />
    
  </div>
</template>
<script setup>
  import ImportData from './ImportData.vue';
  // import ExportData from './ExportData.vue';
  // import { ref } from 'vue';
  // const fileTabs = ref('uploadFile');
</script>
<style lang="scss">

</style>