<template>
    <div class="container-md mx-1.5 border">
        <div class="hide">
            <div class="text-start">
                <h3>Code</h3>
            </div>
            <div class="dov">
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
    </div>    
</template>

<script setup>

</script>

