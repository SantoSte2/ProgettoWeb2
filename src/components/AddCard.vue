<template>

    <div class="container-fluid">
        <div class="container border"><!--container mx-4 my-2 px-2 py-4 border/-->
            <div class="text-start">
                <h3>Aggiungi Libro</h3>
            </div>
            <div class="container mb-3">
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
                            <label for="exampleFormControlTextarea2" class="form-label">Url Copertina</label>
                            <input type="text" class="form-control" id="Copertina" v-model="imgurl"
                                placeholder="Inserisci l'Url della copertina">
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Trama</label>
                            <textarea class="form-control" id="Descrizione" v-model="descrizione"
                                placeholder="Inserisci una breve descrizone" rows="3"></textarea>
                        </div>
                        <div class="d-grid gap-2 d-sm-flex justify-content-sm-end"><!--row-->
                            <button type="submit" class="btn btn-primaryp me-md-2" >Invia</button>

                        </div>
                    </form>
            </div>
            

        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

// impongo vuoti o azzerati i valori del form per ritrovarli vuoti quando ricarico la pagina
const titoloCard = ref('');
const autoreCard = ref('');
const copieCard = ref();
const descrizione = ref('');
const imgurl = ref('');

const toast = useToast();

const onSubmit = async () => {
    if (!titoloCard.value || !copieCard.value || !autoreCard.value || !descrizione.value || !imgurl.value) {
        toast.error('Campi non completati');
        return;
    }

    const cardData = {
        titoloCard: titoloCard.value,
        autoreCard: autoreCard.value,
        copieCard: copieCard.value,
        descrizione: descrizione.value,
        imgurl: imgurl.value
    };

    try {
        // Invio dei dati al server tramite una richiesta POST
        const response = await axios.post('http://localhost:3000/api/libri/aggiungi', cardData);

        // Se l'inserimento è riuscito, mostra un messaggio di successo
        toast.success('Libro aggiunto con successo!');

        // Pulisci i campi del form
        titoloCard.value = '';
        autoreCard.value = '';
        copieCard.value = 0;
        descrizione.value = '';
        imgurl.value = '';
    } catch (error) {
        // Se c'è un errore, mostra un messaggio di errore
        toast.error('Errore durante l\'aggiunta del libro');
        console.error('Errore durante l\'invio dei dati:', error);
    }
};
</script>

