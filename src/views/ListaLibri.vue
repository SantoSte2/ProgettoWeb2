<template>

  <!-- <ListaLibri 
      :listaLibri="listaLibri" 
      @libroCancellato="handleLibroDeleted"
      @prenotaLibro="handleLibroPrenotato"
      @addcopieLibro="handleLibroAggiunto"
    /> -->
  <!-- <About /> -->
  <CardLibri :cardLibri="cardLibri" @cardCancellata="handleCardDeleted" @prenotaCard="handleCardPrenotata"
    @addcopieCard="handleCardAggiunta" />
  <Footer />

</template>

<script setup>

import ListaLibri from '../components/ListaLibri.vue';
import CardLibri from '../components/CardLibri.vue';
import About from '../components/About.vue';
import Footer from '@/components/Footer.vue';

import { ref, computed, onMounted } from 'vue';
import { generateCodeFrame } from 'vue/compiler-sfc';

//importare il TOAST per la visualizzazione delle notifiche carine, e poi chiamarlo toast per semplicita
import { useToast } from 'vue-toastification';
const toast = useToast();


const listaLibri = ref([]);

const cardLibri = ref([]);


//Cancella Libro------------------------------
// dobbiamo catturare l'evento di cancellazione del libro dal componente handleLibroCancellato

const handleLibroDeleted = (id) => {
  listaLibri.value = listaLibri.value.filter(
    (libro) => libro.id !== id
  );

  //prima del toast aggiungo la funzione di salvataggio in memoria dei libri
  // RICORDA LA CHIAMATA AL BACK PER SALVARE AANCHE IL DB LIBRI-------------------------
  listaLibriDaSalvare();

  toast.success('Libro Cancellato');

};

// Cancella card----------------------------

const handleCardDeleted = (id) => {
  cardLibri.value = cardLibri.value.filter(
    (card) => card.id !== id
  );

  listaCardDaSalvare();

  toast.success('Card cancellata');

}


// Funzione Memoria Locale-------------------------------------------------------------
onMounted(() => {
  // nello storage locale posso salvare solo JSON quindi faccio il parse
  const savedlistaLibri = JSON.parse(localStorage.getItem('listaLibri'));

  if (savedlistaLibri) {// se esistono libri salvati allora ricarico quei libri nel web

    listaLibri.value = savedlistaLibri;
  }
  //Funzione carica Card da Memoria locale------------------------------------

  const savedcardLibri = JSON.parse(localStorage.getItem('cardLibri'));

  if (savedcardLibri) {
    cardLibri.value = savedcardLibri;
  }

});




//Salva listaLibri--------------------------------------
// una volta creata la funzione di utilizzo della memoria interna piu sopra craiamo il salvataggio della listaLibri e la richiamiamo ogni volta che cancelliamo o aggiungiamo un libro
const listaLibriDaSalvare = () => {
  //lo storage locale salva solo le stringhe quindi uso stringify per rendere tutto stringhe
  localStorage.setItem('listaLibri', JSON.stringify(listaLibri.value));

};

//Salva Card---------------------------------------

const listaCardDaSalvare = () => {

  localStorage.setItem('cardLibri', JSON.stringify(cardLibri.value));
};

// Prenota il libro---------------------------------



// const handleCardDeleted = (id) =>{
//   cardLibri.value = cardLibri.value.filter(
//     (card) => card.id !== id
//   );



//   toast.success('Card cancellata');

// }

const handleLibroPrenotato = (id) => {

  const libro = listaLibri.value.find(
    (libro) => libro.id === id
  );

  // modificare il numero di copie e aggiornare listaLibri
  libro.copieLibro--;

  listaLibriDaSalvare();

};

const handleCardPrenotata = (id) => {

  const card = cardLibri.value.find(
    (card) => card.id === id

  );

  card.copieCard--;

  listaCardDaSalvare();

  // se prenoto devo prevedere che nel componente il tasto diventa Disable
  // se prenoto devo aggiungere alla lista prenotati un altro libro, fino a tre soli libri prenotati
  // devo fare una funzione count down che conta un mese pre la restituzione del libro

};

//Funzione copie Libro aggiunto-----------------------
const handleLibroAggiunto = (id) => {

  const libro = listaLibri.value.find(
    (libro) => libro.id === id
  );

  libro.copieLibro++;

  listaLibriDaSalvare();

};

const handleCardAggiunta = (id) => {

  const card = cardLibri.value.find(

    (card) => card.id === id

  );

  card.copieCard++;

  listaCardDaSalvare();
}


</script>

<style></style>
