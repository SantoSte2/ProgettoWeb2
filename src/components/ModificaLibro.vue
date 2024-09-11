<template>
    <div class="container-md mx-1.5 border"><!--container mx-4 my-2 px-2 py-4 border-->
      <div class="text-start">
        <h3>Modifica Libro</h3>
      </div>
      <!-- Dropdown per selezionare il libro -->
      <div class="mb-3"><!--mb-3-->
        <label for="libro" class="form-label">Seleziona il Libro</label>
        <select id="libro" class="form-control" v-model="selectedLibroId" @change="caricaDettagliLibro">
          <option value="" disabled>Seleziona un libro...</option>
          <option v-for="libro in libri" :key="libro.idLibro" :value="libro.idLibro">
            {{ libro.Titolo }}
          </option>
        </select>
        <div v-if="!selectedLibroId && formSubmitted" class="text-danger">Seleziona un libro.</div>
      </div>
  
      <!-- Modulo per modificare il libro -->
      <form id="form" @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="text" class="form-label">Titolo Libro</label>
          <input 
            type="text"
            class="form-control" 
            id="text" 
            v-model="titoloLibro" 
            placeholder="Inserisci titolo libro..." 
            required
          />
        </div>
        <div class="mb-3">
          <label for="autore" class="form-label">Autore</label>
          <input 
            type="text"
            class="form-control" 
            id="autore" 
            v-model="autoreLibro" 
            placeholder="Inserisci l'autore del libro..." 
            required
          />
        </div>
        <div class="mb-3">
          <label for="copie" class="form-label">Numero Copie</label>
          <input 
            type="number"
            class="form-control"
            id="copie" 
            min="1" 
            v-model.number="copieLibro" 
            placeholder="Inserisci il numero di copie..." 
            required
          />
        </div>
        <div class="mb-3">
          <label for="immagine" class="form-label">URL Immagine</label>
          <input 
            type="url"
            class="form-control"
            id="immagine" 
            v-model="immagineLibro" 
            placeholder="Inserisci l'URL dell'immagine del libro..." 
            required
          />
        </div>
        <div class="mb-3">
          <label for="trama" class="form-label">Trama</label>
          <textarea
            class="form-control" 
            id="trama" 
            v-model="tramaLibro" 
            placeholder="Inserisci la trama del libro..."
            rows="3"
            required
          ></textarea>
        </div>
        <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
          
          <button class="btn btn-primaryp me-md-2" :disabled="isSubmitting">Salva Modifiche</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useToast } from 'vue-toastification';
  import axios from 'axios';
  
  const libri = ref([]);
  const selectedLibroId = ref(null);
  const titoloLibro = ref('');
  const autoreLibro = ref('');
  const copieLibro = ref(1);
  const tramaLibro = ref('');
  const immagineLibro = ref('');
  const isSubmitting = ref(false);
  const formSubmitted = ref(false);
  
  const toast = useToast();
  const emit = defineEmits(['libroModificato']);
  
  const caricaLibri = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/libri');
      libri.value = response.data;
    } catch (error) {
      console.error('Errore durante il caricamento dei libri:', error);
      toast.error('Errore durante il caricamento dei libri');
    }
  };
  
  const caricaDettagliLibro = async () => {
    if (selectedLibroId.value) {
      try {
        const response = await axios.get(`http://localhost:3000/api/libri/${selectedLibroId.value}`);
        const libro = response.data;
  
        titoloLibro.value = libro.Titolo;
        autoreLibro.value = libro.Autore;
        copieLibro.value = libro.numCopie;
        tramaLibro.value = libro.trama;
        immagineLibro.value = libro.immagine;
      } catch (error) {
        console.error('Errore durante il caricamento del libro:', error);
        toast.error('Errore durante il caricamento del libro');
      }
    } else {
      // Reset dei campi se nessun libro è selezionato
      titoloLibro.value = '';
      autoreLibro.value = '';
      copieLibro.value = 1;
      tramaLibro.value = '';
      immagineLibro.value = '';
    }
  };
  
  const onSubmit = async () => {
    formSubmitted.value = true;
  
    if (!selectedLibroId.value || !titoloLibro.value || !copieLibro.value || copieLibro.value < 1) {
      toast.error('Campo o campi inseriti non validi');
      return;
    }
  
    isSubmitting.value = true;
  
    const libroData = {
      Titolo: titoloLibro.value,
      Autore: autoreLibro.value,
      numCopie: copieLibro.value,
      trama: tramaLibro.value,
      immagine: immagineLibro.value,
    };
  
    try {
      await axios.put(`http://localhost:3000/api/libri/${selectedLibroId.value}`, libroData);
      toast.success('Libro modificato con successo');
      emit('libroModificato', libroData);
    } catch (error) {
      console.error('Errore durante la modifica del libro:', error);
      toast.error('Errore durante la modifica del libro');
    } finally {
      isSubmitting.value = false;
    }
  };
  
  onMounted(() => {
    caricaLibri(); // Carica la lista dei libri quando il componente è montato
  });
  </script>
  