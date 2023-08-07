<template>
  <div class="text-center" style="overflow-x: hidden;">
    <v-menu v-model="setting" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <!-- <v-btn color="indigo" v-bind="props">Menu as Popover
        </v-btn> -->
        <v-btn variant="text" icon="mdi-cog-box" v-bind="props"></v-btn>
      </template>
      <v-card max-width="600">
        <v-row class="row">
          <v-col :cols="4"  v-for="(header, index) in displayRows" :key="index">
            <v-checkbox density="compact" hide-details="true" :label="header.title" v-model="header.select" class="py-0 my-0"
            @change="toggleHeader(header)"></v-checkbox>
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import { takeUntil, Subject } from 'rxjs';
  import { dataService } from '@/service/dataservice';
  const comSubject$ = new Subject();
  const setting = ref(false);
  const displayRows = reactive([]);
  const handleHeadersSelected = (headers) => {
    if(displayRows.length > 0 ) displayRows.length = 0;
    for(let i = 0 ; headers.length > i ; i++){
      displayRows.push({
        title: headers[i],
        select: true,
        index: i
      })
    }
  };
  const toggleHeader = (header) => dataService.toggleHeaderSetting(header);
  dataService.transferHeaderInfo$.pipe(takeUntil(comSubject$)).subscribe((headers)=>{
    handleHeadersSelected(headers)
  });
</script>