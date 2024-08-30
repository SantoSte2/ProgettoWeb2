<template>
  <div class="container mx-4 px-2">
    <div class="hide">
      <ul id="list" class="list">
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
                @click="annullaPrenotazione(prenotazione.idLibro, prenotazione.username)"
                class="btn btn-danger"
              >
                Restituisci
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

const emit = defineEmits([
  'prenotazioneAnnullata',
]);

const listaPrenotazioni = ref([]); // Stato locale per le prenotazioni
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

// Quando il componente è montato, carica le prenotazioni
onMounted(() => {
  fetchPrenotazioni();
});
</script>
