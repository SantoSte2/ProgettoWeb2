<template>
  <div class="col-12">
    <div class="card-group mx-4 my-2">
      <div class="row" v-if="libri.length > 0">
        <div class="card col-4" v-for="libro in libri" :key="libro.idLibro">
          <img :src="libro.immagine" class="card-img-top" :alt="'copertina ' + libro.Titolo">
          <div class="card-body">
            <h5 class="card-title">{{ libro.Titolo }}</h5>
            <h5>Copie: {{ libro.numCopie }}</h5>
            <p class="card-text">{{ libro.trama }}</p>
          </div>
          <div class="container-fluid">
            <div class="row">
              <div class="col-6">
                <button class="btn btn-primary btn-sm" v-if="isLoggedIn" v-show="(libro.numCopie > 0)"
                  @click="prenotaCard(libro.idLibro)">PRENOTA</button>
              </div>
              <div class="col-6">
                <button class="btn btn-warning btn-sm" v-if="isLoggedIn && (libro.numCopie <= 0)"
                  @click="metticodaCard">CODA</button>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <button class="btn btn-primary btn-sm" v-if="isLibr"
                  @click="addcopieCard(libro.idLibro)">RESTITUISCI</button>
              </div>
              <div class="col-6">
                <button class="btn btn-danger btn-sm" v-if="isLibr" 
                  @click="cancellaCard(libro.idLibro)">CANCELLA</button>
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
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const isLibr = computed(() => userStore.isLibr);
const libri = ref([]);
const toast = useToast();

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/libri');
    libri.value = response.data;
  } catch (error) {
    console.error('Errore durante il caricamento dei libri:', error);
    toast.error('Errore durante il caricamento dei libri');
  }
});

const cancellaCard = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/libri/${id}`);
    libri.value = libri.value.filter(libro => libro.idLibro !== id);
    toast.success('Libro cancellato con successo');
  } catch (error) {
    console.error('Errore durante la cancellazione del libro:', error);
    toast.error('Errore durante la cancellazione del libro');
  }
};

const prenotaCard = async (id) => {
  try {
    const libro = libri.value.find(libro => libro.idLibro === id);
    if (libro.numCopie > 0) {
      await axios.patch(`http://localhost:3000/api/libri/prenota/${id}`);
      libro.numCopie--;
      toast.success('Libro prenotato con successo');
    } else {
      toast.error('Nessuna copia disponibile per la prenotazione');
    }
  } catch (error) {
    console.error('Errore durante la prenotazione del libro:', error);
    toast.error('Errore durante la prenotazione del libro');
  }
};

const addcopieCard = async (id) => {
  try {
    await axios.patch(`http://localhost:3000/api/libri/restituisci/${id}`);
    const libro = libri.value.find(libro => libro.idLibro === id);
    libro.numCopie++;
    toast.success('Libro restituito con successo');
  } catch (error) {
    console.error('Errore durante la restituzione del libro:', error);
    toast.error('Errore durante la restituzione del libro');
  }
};
</script>
