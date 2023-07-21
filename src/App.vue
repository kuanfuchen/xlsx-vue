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
  import {/*ref, reactive ,*/ onMounted, /*provide*/} from 'vue';
  onMounted(()=>{})
</script>
