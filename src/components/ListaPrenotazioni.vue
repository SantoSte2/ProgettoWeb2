<template>
  <div class="container-fluid">
    <div class="container-md mx-1.5 border">
      <div class="hide">
        <!-- Mostra i filtri solo se l'utente è un bibliotecario -->
        <div v-if="userStore.isLibr" class="text-start mb-3">
          <h3>Filtri</h3>
          <div class="row mb-3">
            <div class="col-sm-6">
              <select v-model="filtroUtente" class="form-select">
                <option value="">Qualsiasi Utente</option>
                <option
                  v-for="utente in listaUtenti"
                  :key="utente.idUtente"
                  :value="utente.username"
                >
                  {{ utente.username }}
                </option>
              </select>
            </div>
            <div class="col-sm-6">
              <select v-model="filtroLibro" class="form-select">
                <option value="">Qualsiasi Libro</option>
                <option
                  v-for="libro in listaLibri"
                  :key="libro.idLibro"
                  :value="libro.Titolo"
                >
                  {{ libro.Titolo }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sezione Prenotazioni -->
        <div class="text-start">
          <h3>Prenotazioni</h3>
          <div class="container">
            <ul id="list" class="list">
              <!-- Mostra un messaggio se non ci sono prenotazioni -->
              <li v-if="prenotazioniFiltrate.length === 0">Nessuna prenotazione</li>

              <!-- Loop sulla lista delle prenotazioni filtrate -->
              <li
                v-for="prenotazione in prenotazioniFiltrate"
                :key="prenotazione.idPrenotazione"
              >
                <div class="row">
                  <div class="col-sm-3">Titolo: {{ prenotazione.Titolo || 'Non disponibile' }}</div>
                  <div class="col-sm-3">Username: {{ prenotazione.username || 'Non disponibile' }}</div>
                  <div class="col-sm-2">Inizio: {{ formatDate(prenotazione.inizioPren) }}</div>
                  <div class="col-sm-2">Fine: {{ formatDate(prenotazione.finePren) }}</div>
                  <div class="d-grid gap-2 d-md-flex justify-content-sm-end">
                    <button
                      class="btn btn-primaryred me-md-2"
                      @click="annullaPrenotazione(prenotazione.idLibro, prenotazione.username)"
                    >
                      Restituisci
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        

      </div>
    </div>
      <div class="container-md mx-1.5 border">
        <div class="hide">
          <!-- Sezione Code -->
          <Code
            :codeFiltrate="codeFiltrate"
            :formatDate="formatDate"
            :rimuoviDallaCoda="rimuoviDallaCoda"
            @codeUpdated="fetchCode"
          /> 
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import { useUserStore } from '@/stores/user'; // Importa lo store
import Code from './Code.vue'; // Assicurati che il percorso sia corretto

const emit = defineEmits(['prenotazioneAnnullata']);

const listaPrenotazioni = ref([]); // Stato locale per le prenotazioni
const listaCode = ref([]); // Stato locale per le code
const listaUtenti = ref([]); // Stato per la lista degli utenti
const listaLibri = ref([]); // Stato per la lista dei libri
const filtroUtente = ref(''); // Filtro per utente
const filtroLibro = ref(''); // Filtro per titolo del libro
const toast = useToast();
const userStore = useUserStore(); // Accedi allo store

// Funzione per formattare la data
const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

// Funzione per ottenere le prenotazioni dal server
const fetchPrenotazioni = async () => {
  try {
    const url = userStore.isLibr
      ? 'http://localhost:3000/api/prenotazioni'
      : `http://localhost:3000/api/prenotazioni?userId=${userStore.userId}`;

    const response = await axios.get(url);
    listaPrenotazioni.value = response.data;
  } catch (error) {
    toast.error('Errore nel recuperare le prenotazioni');
    console.error(error);
  }
};

// Funzione per ottenere le code dal server
const fetchCode = async () => {
  try {
    const url = userStore.isLibr
      ? 'http://localhost:3000/api/code'
      : `http://localhost:3000/api/code?userId=${userStore.userId}`;

    const response = await axios.get(url);
    listaCode.value = response.data;
  } catch (error) {
    toast.error('Errore nel recuperare le code');
    console.error(error);
  }
};

// Funzione per ottenere la lista degli utenti dal server
const fetchUtenti = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/utenti');
    listaUtenti.value = response.data;
  } catch (error) {
    toast.error('Errore nel recuperare la lista degli utenti');
    console.error(error);
  }
};

// Funzione per ottenere la lista dei libri dal server
const fetchLibri = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/libri');
    listaLibri.value = response.data;
  } catch (error) {
    toast.error('Errore nel recuperare la lista dei libri');
    console.error(error);
  }
};

// Funzione per annullare una prenotazione
const annullaPrenotazione = async (idLibro, username) => {
  try {
    await axios.patch(`http://localhost:3000/api/libri/restituisci/${idLibro}`, {
      idUtente: username
    });
    // Rimuovi la prenotazione dalla lista
    listaPrenotazioni.value = listaPrenotazioni.value.filter(
      (prenotazione) => prenotazione.idLibro !== idLibro || prenotazione.username !== username
    );
    toast.success('Prenotazione annullata');
    emit('prenotazioneAnnullata', idLibro); // Emetti l'evento per il componente padre, se necessario
  } catch (error) {
    toast.error('Errore durante l\'annullamento della prenotazione');
    console.error(error);
  }
};

// Funzione per rimuovere un utente dalla coda
const rimuoviDallaCoda = async (idLibro, username) => {
  try {
    await axios.delete(`http://localhost:3000/api/code/${idLibro}`, {
      data: {
        idUtente: username
      }
    });
    // Rimuovi l'elemento della coda dalla lista
    listaCode.value = listaCode.value.filter(
      (coda) => coda.idLibro !== idLibro || coda.username !== username
    );
    toast.success('Utente rimosso dalla coda');
  } catch (error) {
    toast.error('Errore durante la rimozione dalla coda');
    console.error(error);
  }
};

// Proprietà computate per filtrare le prenotazioni e le code
const prenotazioniFiltrate = computed(() => {
  return listaPrenotazioni.value.filter((prenotazione) => {
    return (
      (filtroUtente.value === '' || prenotazione.username === filtroUtente.value) &&
      (filtroLibro.value === '' || prenotazione.Titolo === filtroLibro.value)
    );
  });
});

const codeFiltrate = computed(() => {
  return listaCode.value.filter((coda) => {
    return (
      (filtroUtente.value === '' || coda.username === filtroUtente.value) &&
      (filtroLibro.value === '' || coda.Titolo === filtroLibro.value)
    );
  });
});

// Quando il componente è montato, carica le prenotazioni, le code, gli utenti e i libri
onMounted(() => {
  fetchPrenotazioni();
  fetchCode();
  fetchUtenti();
  fetchLibri();
});
</script>
