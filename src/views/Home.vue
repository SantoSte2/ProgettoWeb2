<template>

  <!-- <ListaLibri :listaLibri="listaLibri" /> -->
  <CardLibri :cardLibri="cardLibri" />
  <Footer />


</template>

<script setup>

//import ListaLibri from '../components/ListaLibri.vue';
import CardLibri from '../components/CardLibri.vue';
import Footer from '@/components/Footer.vue';


import { defineProps } from 'vue';
import { ref, computed, onMounted } from 'vue';

//const listaLibri = ref([]);

const cardLibri = ref([]);


// Funzione Memoria Locale------------------------------------
onMounted(() => {
  // nello storage locale posso salvare solo JSON quindi faccio il parse
  const savedcardLibri = JSON.parse(localStorage.getItem('cardLibri'));

  if (savedcardLibri) {// se esistono libri salvati allora ricarico quei libri nel web

    cardLibri.value = savedcardLibri;
  }

});

</script>

<style></style>