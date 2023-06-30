<template>
  <v-app >
    <v-main>
      <!-- <HelloWorld /> -->
      <MainInterface></MainInterface>
      
    </v-main>
  </v-app>
</template>

<script setup>
  import MainInterface from './components/MainInterface.vue';
  import {/*ref, */reactive, onMounted, /*provide*/} from 'vue';
  const test1= reactive([1,2,3])
  // import dataService from './service/dataService';
  onMounted(()=>{
    console.log(test1)
  })
  // import HelloWorld from '@/components/HelloWorld.vue'
</script>
