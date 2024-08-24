<template>
  <div class="container mx-4 my-2 px-2 py-3 border">
    <!-- Se l'utente è loggato, mostra il pulsante di logout, altrimenti mostra il modulo di login -->
    <div v-if="isLoggedIn">
      <p>Benvenuto, {{ username }}!</p>
      <button class="btn btn-danger" @click="onLogout">Logout</button>
    </div>
    <div v-else>
      <form @submit.prevent="onSubmit">
        <div class="container mb-3">
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" v-model="email" placeholder="Enter email">
          </div>
        </div>
        <div class="container mb-3">
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" placeholder="Password">
          </div>
        </div>
        <div class="container mt-2 text-end">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const isLoggedIn = userStore.isLoggedIn;
const username = userStore.username;

const onSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value,
    });

    console.log('Server response:', response.data); // Verifica la risposta del server

    if (response.data.success) {
      userStore.setUser(response.data.user); // Salva l'utente nello store
      console.log('User after login:', userStore.user); // Verifica se l'utente è stato impostato correttamente
      toast.success('Login riuscito');
      router.push('/');
    } else {
      toast.error('Login fallito');
    }
  } catch (error) {
    toast.error('Errore durante il login');
    console.error(error);
  }
};

const onLogout = () => {
  userStore.clearUser(); // Pulisci i dati dell'utente nello store
  toast.success('Logout riuscito');
  router.push('/'); // Reindirizza alla pagina di login (o a un'altra pagina di tua scelta)
};
</script>
