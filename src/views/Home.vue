<template>

  <!-- <ListaLibri :listaLibri="listaLibri" /> -->
  <CardLibri :cardLibri="cardLibri" @prenotaCard="handleCardPrenotata" />
  <Footer />


</template>

<script setup>

//import ListaLibri from '../components/ListaLibri.vue';
import CardLibri from '../components/CardLibri.vue';
import Footer from '@/components/Footer.vue';


import { defineProps } from 'vue';
import { ref, computed, onMounted } from 'vue';
//import axios from 'axios';

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

const handleCardPrenotata = (id) => {

  const card = cardLibri.value.find(
    (card) => card.id === id

  );
  // richiesta http per prenotare la card


  axios.post('http://localhost:3000/prenotaCard', {
    id: card.id
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  }
  );


  card.copieCard--;

  listaCardDaSalvare();


};

//Salva Card---------------------------------------

const listaCardDaSalvare = () => {

  localStorage.setItem('cardLibri', JSON.stringify(cardLibri.value));
};



// Funzione per handlePreota()



</script>

<style></style>