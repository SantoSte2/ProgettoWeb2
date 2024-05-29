<template>

  <ListaLibri :listaLibri="listaLibri" />

  

</template>

<script setup>

import ListaLibri from '../components/ListaLibri.vue';

import { defineProps } from 'vue';
import { ref, computed, onMounted} from 'vue';

const listaLibri = ref([]);


// Funzione Memoria Locale------------------------------------
onMounted(() => {
  // nello storage locale posso salvare solo JSON quindi faccio il parse
  const savedlistaLibri = JSON.parse(localStorage.getItem('listaLibri'));

  if(savedlistaLibri){// se esistono libri salvati allora ricarico quei libri nel web
  
    listaLibri.value = savedlistaLibri;
  }

});

</script>

<style>




</style>