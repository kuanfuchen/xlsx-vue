<template>
  <v-card>
    <!-- <v-layout> -->
      <!-- <v-system-bar color="deep-purple darken-3"></v-system-bar> -->
      <v-app-bar prominent color="primary">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>GenoType</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="text" icon="mdi-file-upload" 
          @click="toggledFileManagement = !toggledFileManagement">
        </v-btn>
        <!-- <v-btn variant="text" icon="mdi-filter"></v-btn>
        <v-btn variant="text" icon="mdi-dots-vertical"></v-btn> -->
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="bottom" temporary>
        <v-list :items="items"></v-list>
      </v-navigation-drawer>
      <!-- <v-main style="height: 500px;"> -->
        <!-- <v-card-text>
          The navigation drawer will appear from the bottom on smaller size screens.
        </v-card-text> -->
      <!-- </v-main> -->
    <!-- </v-layout> -->
    <v-dialog
        v-model="toggledFileManagement"
        width="auto"
      >
        <v-card>
          <v-card-title>
            Upload your Xlsx
          </v-card-title>
          <v-card-text>
            <!--  -->
            <FileManagenment />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              @click="toggledFileManagement = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  const drawer = ref(false);
  const toggledFileManagement = ref(true);
  import FileManagenment from './fileManagerment/FileManagement.vue';

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