<template>

    <About />
    <Login />
    

   

</template>

<script setup>

import Login from '../components/Login.vue';
import About from '../components/About.vue';


import { ref, computed, onMounted} from 'vue';
import { useToast } from 'vue-toastification';
const toast = useToast();

</script>
