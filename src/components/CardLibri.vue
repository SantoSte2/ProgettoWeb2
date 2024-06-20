<template>

    <div class="d-flex flex-row mx-3 px-2">
        <div class="card-group">
            <div class="card" v-for="card in cardLibri" :key="card.id">
                <img src="" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">{{ card.titoloCard }}</h5>
                    <h5>{{ card.copieCard }}</h5>
                    <p class="card-text">{{ card.descrizione }}</p>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-6">
                                <button class="btn btn-primary" v-show="(card.copieCard)"
                                    @click="prenotaCard(card.id)">PRENOTA</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-warning" v-if="(card.copieCard) <= 0"
                                    @click="metticodaCard">CODA</button>
                            </div>

                        </div>
                        <div class="row">
                            <div class="col-6">
                                <button class="btn btn-primary" @click="addcopieCard(card.id)">RESTITUISCI</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-primary" @click="cancellaCard(card.id)">CANCELLA</button>
                            </div>
                        </div>




                    </div>
                </div>
            </div>

        </div>
    </div>


</template>

<script setup>

import { defineProps } from 'vue';
import { ref, computed, onMounted } from 'vue';


const emit = defineEmits(['cardCancellata', 'prenotaCard', 'addcopieCard']);


//qui definisco questa listaLibri che deve essere un array e richiesto vero
const props = defineProps({

    cardLibri: {
        type: Array,
        required: true,
    },
});

// definisco la funzione di cancellazione della Card
const cancellaCard = (id) => {
    emit('cardCancellata', id);
};

const prenotaCard = (id) => {
    emit('prenotaCard', id);
};

const addcopieCard = (id) => {
    emit('addcopieCard', id);
};


</script>
