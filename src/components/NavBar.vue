<template>
  <v-card>
      <v-app-bar prominent color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>GenoType</v-toolbar-title>
        <v-spacer></v-spacer>
        <ExportFile />
        <v-btn variant="text" icon="mdi-file-upload" 
          @click="toggledFileManagement = !toggledFileManagement">
        </v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" location="bottom" temporary>
        <v-list :items="items"></v-list>
      </v-navigation-drawer>
    <v-dialog v-model="toggledFileManagement" width="auto" persistent>
        <v-card>
          <v-card-title>
            Upload your Xlsx
          </v-card-title>
          <v-card-text>
            <FileManagenment />
          </v-card-text>
          <v-card-actions>
            <v-btn class="text-none ml-auto"
              color="primary"
              variant="outlined"
              @click="toggledFileManagement = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  // const definedFileManagement = defineProps(['toggleFileManagement'])
  const drawer = ref(false);
  const toggledFileManagement = ref(true);
  import FileManagenment from './fileManagerment/FileManagement.vue';
  import ExportFile from './fileManagerment/ExportData.vue';
  // const group = ref(null);
  const items = reactive(
  [{
      title: 'Foo',
      value: 'foo',
    },
    {
      title: 'Buzz',
      value: 'buzz',
    }]);

</script>