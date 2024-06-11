<template>

  <div class="container mx-4 px-2 border">
    

        <h3>AddLibro</h3>
        <form id="form" @submit.prevent="onSubmit"><!--questo form consente di inviare dati relativi ad un libro che aggiungo io, direttamente a tutto il sito, dobbiamo passare tutto bene ed in modo che sia reattivo-->
            <div class="mb-3">
              <label for="text">Titolo Libro</label>
              <!--una volta che inseriamo gli attributi del libro dobbiamo memorizzarli con la direttiva v-model su tutti e due i campi che chiediamo sia testolibro che le copie-->
              <input type="text"id="text" v-model="titoloLibro" placeholder="Inserisci titolo libro...">
            </div>
            <div class="mb-3">
              <label for="copie">Numero Copie</label>
              <input type="number" id="numeroCopie" value="1" min="1" v-model="copieLibro" placeholder="Inserici il numero copie libro...">
            </div>
          <button class="btn btn-primary">Invia</button>
        </form>
    
  </div>

</template>

<script setup>
// inserisci qui la parte di JS del componente per la logica di calcolo e formule
  
  // importo tutto quello che mi serve per lavorare 
  import { ref } from 'vue';
  import { useToast } from 'vue-toastification';

  // azzero i campi di immisione che mi servono puliti per il primo giro
  const titoloLibro = ref('');
  const copieLibro = ref();

  // funzione di EMISSIONE EVENTO-----------------------------
  // con defineEmits emetto un array[] personalizzato di parametri (quelli del mio libro inserito) dentro una variabile che dovro condividere con app.vue
  const emit = defineEmits(['libroSubmitted','onSubmit']);

  //---------------------------------------TOAST--------------------------------
  // importo il Toast per segnalare in maniera bellina che ho Sbagliato o ho fatto bene
  const toast = useToast();
  
  const onSubmit = () => {//FUNZIONE TASTO SUBMIT se submitto il tasto e almeno dei due campi non è corretto allora mando l'alert carino che è sbagliato col Toast
      if(!titoloLibro.value || !copieLibro.value){
      toast.error('Campo o campi inseriti non validi');
      return;
      }
    // prima di azzerare i campi impacchetto il tipo di dati che andro a rendere pubblico per tutti i componenti
      const libroData = {
      titoloLibro: titoloLibro.value,
      copieLibro: copieLibro.value,
      }
    // emetto il pacchetto con la funzione di emits fornendo il dato sopra, l'evento ha il nome personalizzato che sara poi in app.vue
    emit('libroSubmitted',libroData);



    //azzero e pulisco i campi tutte le volte che inserisco i valori   
    titoloLibro.value = '';
    copieLibro.value = 0; 
  };



</script>

