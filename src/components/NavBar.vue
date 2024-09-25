<template>
  <div class="navbar">
    <div class="container-fluid">
      <nav class="navbar navbar-expand-sm bg-body-tertiary">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
              <RouterLink v-if="isLoggedIn" class="nav-link" aria-current="page" to="/ListaLibri">Prenotazioni
              </RouterLink>
              <!-- Link "Aggiungi Libro" visibile solo se isLibr è true -->
              <RouterLink v-if="isLibr" class="nav-link" aria-current="page" to="/AddLibro">Aggiungi Libro</RouterLink>
              <RouterLink class="nav-link" aria-current="page" to="/Login">Login</RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);
// Usa un getter per determinare se l'utente ha isLibr=true
const isLibr = computed(() => userStore.isLibr);
</script>

<style lang="css">

</style>
