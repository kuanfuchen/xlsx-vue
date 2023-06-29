<template>
  <div>
    <v-file-input
    show-size
    label="Excel input"
    variant="outlined"
    accept=".xlsx"
    @change="inputXlsxFile($event)"
  ></v-file-input>
  </div>
</template>
<script setup>
  // import {ref} from 'vue';
  import { read, utils, writeFile } from 'xlsx';

  const inputXlsxFile = (ev)=>{
    if(ev.target.files.length === 0)return;
    const xlsxFile = ev.target.files[0];
    console.log(xlsxFile, 'xlsxFile')
    const xlsxFileReader = new FileReader();
    xlsxFileReader.readAsText(xlsxFileReader)
    xlsxFileReader.onload = (e)=>{
      const result  = e.target.result;
      console.log(result)
    }
    
  } 
</script>