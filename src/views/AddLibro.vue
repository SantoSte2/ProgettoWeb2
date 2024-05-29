<template>

  <AddLibro @libroSubmitted="handleLibroSubmitted" />
  <AddCard @cardSubmitted="handleCardSubmitted" />
  
</template>

<script setup>

import AddLibro from '../components/AddLibro.vue';
import AddCard from '../components/AddCard.vue';

import { ref, computed, onMounted} from 'vue';
import { generateCodeFrame } from 'vue/compiler-sfc';

//importare il TOAST per la visualizzazione delle notifiche carine, e poi chiamarlo toast per semplicita
import { useToast } from 'vue-toastification';
const toast = useToast();


const listaLibri = ref([]);

const cardLibri = ref([]);


//Add Libro----------------------------
// con questa funzione manca un ID per inserire il libro o l'oggetto quindi creo la funzione di creazione random ID
const handleLibroSubmitted = (libroData) => {
  //metto dentro il mio array listaLibri pushando dentro valori nuovi che prendo da AddLibri il componente
    listaLibri.value.push({
      id:generaId(),
      titoloLibro: libroData.titoloLibro,
      copieLibro:libroData.copieLibro,
    });
    //console.log(generaId());

    //prima di mandare il toast salvo in memoria con la funzione di salvataggio del nuovo libro
    listaLibriDaSalvare();

    //usiamo la notifica carina toast per dire Libro aggiunto
    toast.success('Libro aggiunto con successo');

};

//Add Card----------------------------------

const handleCardSubmitted = (cardData) => {

  cardLibri.value.push({
    id:generaId(),
    titoloCard: cardData.titoloCard,
    autoreCard: cardData.autoreCard,
    copieCard: cardData.copieCard,
    descrizione: cardData.descrizione
  });

    listacardDaSalvare();

    toast.success('Card Aggiunta');

};

//Generare id Unico-----------------------------

const generaId = () =>{

  return  Math.floor(Math.random() * 1000000);
};



// Funzione Memoria Locale------------------------------------
onMounted(() => {
  // nello storage locale posso salvare solo JSON quindi faccio il parse
  const savedlistaLibri = JSON.parse(localStorage.getItem('listaLibri'));

  if(savedlistaLibri){// se esistono libri salvati allora ricarico quei libri nel web
  
    listaLibri.value = savedlistaLibri;
  }

  // card libri da salvare-------------------------------------------

  const savedcardLibri = JSON.parse(localStorage.getItem('cardLibri'));

  if(savedcardLibri){

    cardLibri.value = savedcardLibri;
  }

});

  //Salva listaLibri--------------------------------------
  // una volta creata la funzione di utilizzo della memoria interna piu sopra craiamo il salvataggio della listaLibri e la richiamiamo ogni volta che cancelliamo o aggiungiamo un libro
  const listaLibriDaSalvare = () =>{
    //lo storage locale salva solo le stringhe quindi uso stringify per rendere tutto stringhe
    localStorage.setItem('listaLibri', JSON.stringify(listaLibri.value));

  };

  //Salva cardLibri--------------------------------------
  const listacardDaSalvare = () =>{

    localStorage.setItem('cardLibri',JSON.stringify(cardLibri.value));
  
  };



</script>

