<template>
  <div class="container mx-4 px-2">
    <div class="hide">
      <!-- Sezione Prenotazioni -->
      <h3>Prenotazioni</h3>
      <ul id="list" class="list">
        <!-- Mostra un messaggio se non ci sono prenotazioni -->
        <li v-if="listaPrenotazioni.length === 0">Nessuna prenotazione</li>
        
        <!-- Loop sulla lista delle prenotazioni -->
        <li
          v-for="prenotazione in listaPrenotazioni"
          :key="prenotazione.idPrenotazione"
        >
          <div class="row">
            <!-- Visualizza i campi specifici della prenotazione -->
            <div class="col-sm-3">Titolo: {{ prenotazione.Titolo || 'Non disponibile' }}</div>
            <div class="col-sm-3">Username: {{ prenotazione.username || 'Non disponibile' }}</div>
            <div class="col-sm-3">Inizio: {{ formatDate(prenotazione.inizioPren) }}</div>
            <div class="col-sm-3">Fine: {{ formatDate(prenotazione.finePren) }}</div>
            <div class="col-sm-3">
              <!-- Pulsante per annullare la prenotazione -->
              <button
                @click="annullaPrenotazione(prenotazione.idLibro, prenotazione.idUtente)"
                class="btn btn-danger"
              >
                Restituisci
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Sezione Code -->
      <h3>Code</h3>
      <ul id="list" class="list">
        <!-- Mostra un messaggio se non ci sono code -->
        <li v-if="listaCode.length === 0">Nessuna coda</li>
        
        <!-- Loop sulla lista delle code -->
        <li
          v-for="coda in listaCode"
          :key="coda.idCoda"
        >
          <div class="row">
            <!-- Visualizza i campi specifici della coda -->
            <div class="col-sm-3">Titolo: {{ coda.Titolo || 'Non disponibile' }}</div>
            <div class="col-sm-3">Username: {{ coda.username || 'Non disponibile' }}</div>
            <div class="col-sm-3">Data Inserimento: {{ formatDate(coda.dataInserimento) }}</div>
            <div class="col-sm-3">
              <!-- Pulsante per rimuovere l'utente dalla coda -->
              <button
                @click="rimuoviDallaCoda(coda.idLibro, coda.idUtente)"
                class="btn btn-danger"
              >
                Rimuovi dalla coda
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import moment from 'moment';
import { useUserStore } from '@/stores/user'; // Importa lo store

const emit = defineEmits(['prenotazioneAnnullata']);

const listaPrenotazioni = ref([]); // Stato locale per le prenotazioni
const listaCode = ref([]); // Stato locale per le code
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
    // Effettua la richiesta DELETE con il payload nel corpo della richiesta
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

// Quando il componente è montato, carica le prenotazioni e le code
onMounted(() => {
  fetchPrenotazioni();
  fetchCode();
});
</script>
