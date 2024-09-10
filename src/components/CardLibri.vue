<template>
  <div class="col-12"><!--col-12/container-lg-->
    <div class="card-group mx-4 my-2">
      <div class="row" v-if="libri.length > 0">
        <div class="card col-md-4" v-for="libro in libri" :key="libro.idLibro"><!--col-4/card-md-->
          <img :src="libro.immagine" class="card-img-top" :alt="'copertina ' + libro.Titolo">
          <div class="card-body">
            <h5 class="card-title">{{ libro.Titolo }}</h5>
            <h5>Copie Disponibili: {{ libro.numCopie }}</h5>
            <p class="card-text">{{ libro.trama }}</p>
          </div>
          <div class="container">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-primary"
                v-if="isLoggedIn && !libro.isPrenotato && (libro.numCopie > 0)"
                @click="prenotaCard(libro.idLibro)">PRENOTA</button>
              <button type="button" class="btn btn-primarywarning"
                v-if="isLoggedIn && !libro.isPrenotato && (libro.numCopie <= 0)"
                @click="metticodaCard(libro.idLibro)">CODA</button>
              <!-- Mostra il pulsante "Restituisci" solo se l'utente è loggato e ha prenotato il libro -->
              <button type="button" class="btn btn-primary" v-if="isLoggedIn && libro.isPrenotato"
                @click="restituisciCard(libro.idLibro)">RESTITUISCI</button>
              <button type="button" class="btn btn-primaryred btn-sm" v-if="isLibr"
                @click="cancellaCard(libro.idLibro)">CANCELLA</button>
            </div>
          </div>

          <!---->

          <!---->
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
  if (isLoggedIn.value) { // Verifica se l'utente è loggato
    try {
      const idUtente = userStore.user.idUtente;
      const response = await axios.get('http://localhost:3000/api/libri', {
        params: { idUtente: idUtente }
      });
      libri.value = response.data;
    } catch (error) {
      console.error('Errore durante il caricamento dei libri:', error);
      toast.error('Errore durante il caricamento dei libri');
    }
  } else {
    // Se non loggato, carica solo i libri senza info sulle prenotazioni
    try {
      const response = await axios.get('http://localhost:3000/api/libri');
      libri.value = response.data;
    } catch (error) {
      console.error('Errore durante il caricamento dei libri:', error);
      toast.error('Errore durante il caricamento dei libri');
    }
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
  if (!isLoggedIn.value) {
    toast.error('Devi essere loggato per prenotare un libro');
    return;
  }

  try {
    const libro = libri.value.find(libro => libro.idLibro === id);
    if (libro.numCopie > 0) {
      const idUtente = userStore.user.idUtente;
      await axios.patch(`http://localhost:3000/api/libri/prenota/${id}`, {
        idUtente: idUtente
      });
      libro.numCopie--;
      libro.isPrenotato = true; // Aggiorna lo stato locale per riflettere la prenotazione
      toast.success('Libro prenotato con successo');
    } else {
      toast.error('Nessuna copia disponibile per la prenotazione');
    }
  } catch (error) {
    console.error('Errore durante la prenotazione del libro:', error);
    toast.error('Errore durante la prenotazione del libro');
  }
};

const metticodaCard = async (id) => {
  if (!isLoggedIn.value) {
    toast.error('Devi essere loggato per metterti in coda per un libro');
    return;
  }

  try {
    const libro = libri.value.find(libro => libro.idLibro === id);
    const idUtente = userStore.user.idUtente;

    await axios.patch(`http://localhost:3000/api/libri/prenota/${id}`, {
      idUtente: idUtente,
      inCoda: true
    });

    libro.isPrenotato = false; // Aggiorna lo stato locale se necessario
    toast.success('Sei stato aggiunto alla coda per questo libro');
  } catch (error) {
    console.error('Errore durante l\'aggiunta alla coda del libro:', error);
    toast.error('Errore durante l\'aggiunta alla coda del libro');
  }
};

const restituisciCard = async (id) => {
  if (!isLoggedIn.value) {
    toast.error('Devi essere loggato per restituire un libro');
    return;
  }

  try {
    const idUtente = userStore.user.idUtente;
    const response = await axios.patch(`http://localhost:3000/api/libri/restituisci/${id}`, {
      idUtente: idUtente
    });

    const libro = libri.value.find(libro => libro.idLibro === id);

    if (response.data.message.includes('assegnato al prossimo utente in coda')) {
      // Se il libro è stato assegnato a un utente in coda, non incrementare numCopie
      libro.isPrenotato = false;
    } else {
      // Se il libro non è stato assegnato a nessuno in coda, incrementa numCopie
      libro.numCopie++;
      libro.isPrenotato = false; // Aggiorna lo stato locale per riflettere la restituzione
    }

    toast.success(response.data.message);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error('Nessuna prenotazione trovata per questo libro e utente');
    } else {
      console.error('Errore durante la restituzione del libro:', error);
      toast.error('Errore durante la restituzione del libro');
    }
  }
};
</script>
