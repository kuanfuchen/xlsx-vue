<template>
  <div class="mx-2">
    <h3>Filter: </h3>
    <div class="d-flex">
      <v-select class="mx-2"
        :items="definedProps.filterItems"
        label="All Field"
        solo
      ></v-select>
      <v-select class="mr-2"
        :items="textType"
        label="Type"
        solo
      ></v-select>
      <v-input>

      </v-input>
    </div>
    <v-btn outlined color="primary">Enter</v-btn>
  </div>
</template>
<script setup>
  import {ref,/* reactive */} from 'vue';
  // import { Subject, takeUntil } from 'rxjs';
  // import {dataService} from '../../service/dataservice';
  const textType = ref(['Text', 'Number', 'Date']);
  const definedProps = defineProps(['filterItems']);
  // const comSubject$ = new Subject();
  
</script>