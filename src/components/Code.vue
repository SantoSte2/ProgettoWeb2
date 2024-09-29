<template>
  
      <div class="hide">
          <div class="text-start">
              <h3>Code</h3>
          </div>
          <div class="dov">
              <ul id="list" class="list">
                  <!-- Mostra un messaggio se non ci sono code -->
                  <li v-if="codeFiltrate.length === 0">Nessuna coda</li>
              
                  <!-- Loop sulla lista delle code filtrate -->
                  <li
                  v-for="coda in codeFiltrate"
                  :key="coda.idCoda"
                  >
                      <div class="row">
                          <!-- Visualizza i campi specifici della coda -->
                          <div class="col-sm-3">Titolo: {{ coda.Titolo || 'Non disponibile' }}</div>
                          <div class="col-sm-3">Username: {{ coda.username || 'Non disponibile' }}</div>
                          <div class="col-sm-3">Data Inserimento: {{ formatDate(coda.dataInserimento) }}</div>
                          <div class="d-grid gap-2 d-md-flex justify-content-sm-end">
                              <!-- Pulsante per rimuovere l'utente dalla coda -->
                              <button
                                  @click="rimuoviDallaCoda(coda.idLibro, coda.idUtente)"
                                  class="btn btn-primaryred me-md-2"
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
import { computed } from 'vue';
import moment from 'moment';

// Props passati dal componente genitore
const props = defineProps({
codeFiltrate: Array,
formatDate: Function,
rimuoviDallaCoda: Function
});

// Funzione per formattare la data
const formatDate = (date) => {
return moment(date).format('YYYY-MM-DD');
};

// Proprietà computate per ottenere le code filtrate
const codeFiltrate = computed(() => props.codeFiltrate);

// Funzione per rimuovere un utente dalla coda
const rimuoviDallaCoda = (idLibro, username) => {
props.rimuoviDallaCoda(idLibro, username);
};
</script>
