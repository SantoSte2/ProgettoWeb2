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
import { ref, onMounted } from 'vue';

const libri = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost/search.php');
    libri.value = response.data;
  } catch (error) {
    console.error('Errore durante il caricamento dei libri:', error);
  }
});

const cancellaCard = async (id) => {
  try {
    await axios.delete(`http://localhost/delete.php?id=${id}`);
    libri.value = libri.value.filter(libro => libro.idLibro !== id);
    alert('Libro cancellato con successo');
  } catch (error) {
    console.error('Errore durante la cancellazione del libro:', error);
  }
};

const prenotaCard = async (id) => {
  try {
    const libro = libri.value.find(libro => libro.idLibro === id);
    if (libro.numCopie > 0) {
      await axios.patch(`http://localhost/prenota.php?id=${id}`);
      libro.numCopie--;
      alert('Libro prenotato con successo');
    }
  } catch (error) {
    console.error('Errore durante la prenotazione del libro:', error);
  }
};

const addcopieCard = async (id) => {
  try {
    await axios.patch(`http://localhost/restituisci.php?id=${id}`);
    const libro = libri.value.find(libro => libro.idLibro === id);
    libro.numCopie++;
    alert('Libro restituito con successo');
  } catch (error) {
    console.error('Errore durante la restituzione del libro:', error);
  }
};
</script>
