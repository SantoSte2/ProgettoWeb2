<template>
    <div class="col-12">
      <div class="card-group mx-4 my-2">
  
        <div class="row" v-if="libri.length > 0">
          <div class="card col-4" v-for="libro in libri" :key="libro.idLibro">
            <img :src="libro.immagine" class="card-img-top" :alt="'copertina ' + libro.titoloCard">
            <div class="card-body">
              <h5 class="card-title">{{ libro.Titolo }}</h5>
              <h5>Copie: {{ libro.numCopie }}</h5>
              <p class="card-text">{{ libro.trama }}</p>
            </div>
            <div class="container-fluid">
              <div class="row">
                <div class="col-6">
                  <button class="btn btn-primary btn-sm" v-show="(libro.numCopie > 0)"
                    @click="prenotaCard(libro.idLibro)">PRENOTA</button>
                </div>
                <div class="col-6">
                  <button class="btn btn-warning btn-sm" v-if="(libro.numCopie) <= 0"
                    @click="metticodaCard">CODA</button>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <button class="btn btn-primary btn-sm"
                    @click="addcopieCard(libro.idLibro)">RESTITUISCI</button>
                </div>
                <div class="col-6">
                  <button class="btn btn-primary btn-sm" @click="cancellaCard(libro.idLibro)">CANCELLA</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Caricamento in corso...</p>
        </div>
      </div>
    </div>
</template>

<script setup>

import axios from 'axios';
import { defineProps } from 'vue';
import { ref, computed, onMounted } from 'vue';


const emit = defineEmits(['cardCancellata', 'prenotaCard', 'addcopieCard']);


//qui definisco questa listaLibri che deve essere un array e richiesto vero
const props = defineProps({

});
const libri = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost/search.php'); // Sostituisci con il tuo endpoint
    libri.value = response.data; // Aggiorna lo stato con i dati ricevuti
  } catch (error) {
    console.error('Errore durante il caricamento dei libri:', error);
  }
});

// definisco la funzione di cancellazione della Card
const cancellaCard = (id) => {
    emit('cardCancellata', id);
};

const prenotaCard = (id) => {
    emit('prenotaCard', id);
};

const addcopieCard = (id) => {
    emit('addcopieCard', id);
};


</script>
