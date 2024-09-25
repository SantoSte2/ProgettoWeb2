<template>
  <!-- Componente per aggiungere una nuova card -->
  <AddCard @cardSubmitted="handleCardSubmitted" />

  <!-- Componente per modificare un libro esistente -->
  <ModificaLibro @libroModificato="aggiornaListaLibri" :libri="cardLibri" />

  <!-- Footer -->
  <Footer />
</template>

<script setup>
import AddCard from '../components/AddCard.vue';
import ModificaLibro from '../components/ModificaLibro.vue';
import Footer from '../components/Footer.vue';
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const cardLibri = ref([]);

// Funzione per gestire l'aggiunta di una nuova card
const handleCardSubmitted = (cardData) => {
  cardLibri.value.push({
    id: generaId(),
    titoloCard: cardData.titoloCard,
    autoreCard: cardData.autoreCard,
    copieCard: cardData.copieCard,
    descrizione: cardData.descrizione,
    imgurl: cardData.imgurl,
  });

  listacardDaSalvare();

  toast.success('Card Aggiunta');
};

// Funzione per generare un ID unico
const generaId = () => {
  return Math.floor(Math.random() * 1000000);
};

// Funzione per salvare le card in locale
const listacardDaSalvare = () => {
  localStorage.setItem('cardLibri', JSON.stringify(cardLibri.value));
};

// Funzione per aggiornare la lista dei libri dopo una modifica
const aggiornaListaLibri = (libroModificato) => {
  const indice = cardLibri.value.findIndex(libro => libro.id === libroModificato.id);

  if (indice !== -1) {
    cardLibri.value[indice] = libroModificato;
    listacardDaSalvare();
    toast.success('Libro modificato con successo');
  }
};

// Funzione per caricare le card salvate in locale al montaggio del componente
onMounted(() => {
  const savedcardLibri = JSON.parse(localStorage.getItem('cardLibri'));

  if (savedcardLibri) {
    cardLibri.value = savedcardLibri;
  }
});
</script>
