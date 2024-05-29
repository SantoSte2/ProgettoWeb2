<template>
  <div class="container">
    <Header />
    <NavBar />


    <RouterView />
  </div>
</template>



<script setup>

  import { RouterLink, RouterView } from 'vue-router'
  import { ref } from 'vue';
  import { useToast } from 'vue-toastification';

  const toast = useToast();

  const titoloLibro = ref('');
  const copieLibro = ref();



  import Header from './components/Header.vue';
  import Home from './views/Home.vue';
  import NavBar from './components/NavBar.vue';
  import Login from './views/Login.vue';
  import AddLibro from './views/AddLibro.vue';
  import About from './views/About.vue';


</script>