<template>
    <v-col cols="12" sm="2">
      <v-select dense outlined :hide-details="true"
        :items="definedProp.propsItems" v-model="selectedItem"
        label="Select sheet" @update:modelValue="clickedItem">
      </v-select>
    </v-col>
</template>
<script setup>
  import {ref, onMounted} from 'vue';
  const definedProp = defineProps(['propsItems']);
  const definedEmit  = defineEmits(['selectItem']);
  const selectedItem = ref('');
  const clickedItem = (item)=>{
    console.log(item,'item')
    selectedItem.value = item;
    definedEmit('selectItem',item)
  }
  onMounted(() => {
    selectedItem.value = definedProp.propsItems[0];
  });
</script>