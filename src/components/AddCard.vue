<template>


    <div class="container mx-4 px-2 border">
        <h3>Aggiungi Libro</h3>
        <form id="addcard" @submit.prevent="onSubmit">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Titolo</label>
                <input type="text" class="form-control" id="Titolo" v-model="titoloCard"
                    placeholder="Inserisci il titolo">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput2" class="form-label">Autore</label>
                <input type="text" class="form-control" id="Autore" v-model="autoreCard"
                    placeholder="Inserisci l'autore">
            </div>
            <div class="mb-3">
                <label for="copie" class="form-label">Numero Copie</label>
                <input type="number" class="form-control" id="copie" v-model="copieCard"
                    placeholder="Inserisci il numero copie">
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Breve Intro</label>
                <textarea class="form-control" id="Descrizione" v-model="descrizione"
                    placeholder="Iserisci una breve descrizone" rows="3"></textarea>
            </div>
            <div class="row">
                <div class="col-10"></div>
                <div class="col-2">
                    <button class="btn btn-primary" type="submit">Inserisci valori</button>
                </div>

            </div>
        </form>

    </div>

</template>

<script setup>

import { ref } from 'vue';
import { useToast } from 'vue-toastification';

// impongo vuoti o azzerati i valori del form per ritrovarli vuoti quando ricarico la pagina
const titoloCard = ref('');
const autoreCard = ref('');
const copieCard = ref();
const descrizione = ref('');

const emit = defineEmits(['cardSubmitted', 'onSubmit']);


const toast = useToast();

const onSubmit = () => {

    if (!titoloCard.value || !copieCard.value || !autoreCard.value || !descrizione.value) {

        toast.error('Campi non completati');
        return;
    }

    const cardData = {

        titoloCard: titoloCard.value,
        autoreCard: autoreCard.value,
        copieCard: copieCard.value,
        descrizione: descrizione.value
    }

    emit('cardSubmitted', cardData);

    titoloCard.value = '';
    autoreCard.value = '';
    copieCard.value = 0;
    descrizione.value = '';

};

</script>
