<template>
    <div class="container mx-4 px-2">
        <div class="hide">
            <ul id="list" class="list"><!--per luppare su qualcosa, in questo caso la lista degli elementi ,usiamo la direttiva v-for-->
                <!--la dicitura di libro, che scorre il lista libri, potrebbe essere anche una qualsiasi parola-->
                <!--per luppare come scritto prima dobbiamo chiaramente avere un valore unico una KEY su cui luppare, quindi settiamo il valora v-bind:kay sul id dei libri.....il v-bind:kay su puo abbreviare con :kay -->
                <li v-for="libro in listaLibri"
                    :key="libro.id"
                    :class="libro.copieLibro < 0 ? 'minus' : 'plus' "
                    >
                    
                    <div class="row">
                            
                        <!--qui sotto per cambiare il valore contestualmente a quello scritto in array devo mettere le {{}} per collegare il valore in questo loop al dom quindi al sito per aggiornarlo in maniera contestuale-->
                        <div class="col-sm-5">{{ libro.titoloLibro }}</div>
                        <div class="col-sm-3">{{ libro.copieLibro }}</div>
                        <!--sfruttiamo il pulsante di cancellazione libro per cancellarlo passandogli l'id del libro-->
                        <div class="col-sm-4">
                                    
                            <button v-show="(libro.copieLibro)" @click="prenotaLibro(libro.id)" class="btn btn-primary">Prenota</button>
                            <button v-if="(libro.copieLibro) <= 0" class="btn btn-warning">Metti in Coda</button>
                            <button @click="addcopieLibro(libro.id)" class="btn btn-primary">Restituisci</button>
                            <button @click="cancellaLibro(libro.id)" class="btn btn-danger">x</button>
                        </div>    
                                    
                    </div>
                                
                        
                
                </li>

            </ul>
        </div>
    </div>

</template>

<script setup>

//import { type } from 'express/lib/response';
//   import { type } from 'express/lib/response';

//
import { defineProps } from 'vue';

//creo un elemento custom per cancellare il libro, lo emetto cioè lo rendo disponibile all ascolto a tutti i componenti quindi in app.vue dove risiedono tutti i libri
const emit = defineEmits(['libroCancellato', 'prenotaLibro','addcopieLibro']);


//qui definisco questa listaLibri che deve essere un array e richiesto vero
    const props = defineProps({
        
        listaLibri:{
            type: Array,
            required: true,
        },
    });

//Funzione Cancellazione----------------------------
const cancellaLibro = (id) => {
    emit('libroCancellato',id);

};

//Funzione prenota libro--------
const prenotaLibro = (id) => {
    emit('prenotaLibro',id);
    
};

//Funzione aggiungi copie libro---------------------
const addcopieLibro = (id) => {
    emit('addcopieLibro',id)
};


    

</script>

