<template>
  <div class="container-fluid"><!--mx-4 my-2 px-2 py-3/container-md-->
    <!-- Se l'utente è loggato, mostra il pulsante di logout, altrimenti mostra il modulo di login/registrazione -->
    <div class="container-fluid border" v-if="isLoggedIn">
        <p>Benvenuto, {{ username }}!</p>
      
      <div class="d-grid gap-2 d-md-flex justify-content-sm-end">
        <button class="btn btn-primaryred me-md-2" @click="onLogout">Logout</button>
      </div>

    </div>
    <div class="container gx-1 border" v-else>
      <div v-if="isRegistering">
        <!-- Modulo di registrazione -->
        <form @submit.prevent="onRegister">
          <div class="container mb-3">
            <div class="form-group">
              <label for="registerEmail">Email</label>
              <input type="email" class="form-control" id="registerEmail" v-model="registerEmail"
                placeholder="Inserire email" required>
            </div>
          </div>
          <div class="container mb-3">
            <div class="form-group">
              <label for="registerPassword">Password</label>
              <input type="password" class="form-control" id="registerPassword" v-model="registerPassword"
                placeholder="Password" required>
            </div>
          </div>
          <div class="container mb-3">
            <div class="form-group">
              <label for="registerConfirmPassword">Conferma Password</label>
              <input type="password" class="form-control" id="registerConfirmPassword" v-model="registerConfirmPassword"
                placeholder="Conferma Password" required>
            </div>
          </div>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
            <!--container mt-2 text-end/d-grid gap-2 d-md-flex justify-content-sm-end-->
            <button type="submit" class="btn btn-primaryp me-md-2">Registra</button>
            <button type="button" class="btn btn-primarysecond me-md-2" @click="toggleForm">Torna a Login</button>
          </div>
        </form>
      </div>
      <div class="container" v-else>
        <!-- Modulo di login -->
        <form @submit.prevent="onLogin">
            <div class="form-group mt-3 mb-3">
              <label for="loginEmail">Email</label>
              <input type="email" class="form-control" id="loginEmail" v-model="email" placeholder="Inserire email"
                required>
            </div>
            <div class="form-group mb-3">
              <label for="loginPassword">Password</label>
              <input type="password" class="form-control" id="loginPassword" v-model="password" placeholder="Password"
                required>
            </div>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-end">
            <!--container mt-2 text-end/d-grid gap-2 d-sm-flex justify-content-sm-end-->
            <button type="submit" class="btn btn-primaryp me-md-2">Login</button>
            <button type="button" class="btn btn-primarysecond me-md-2" @click="toggleForm">Vai a Registra</button>
          </div>
        </form>
      </div>
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
const registerEmail = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const isLoggedIn = userStore.isLoggedIn;
const username = userStore.username;
const isRegistering = ref(false);

const onLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      userStore.setUser(response.data.user); // Salva l'utente nello store
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

const onRegister = async () => {
  if (registerPassword.value !== registerConfirmPassword.value) {
    toast.error('Le password non corrispondono');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/api/utenti/registrazione', {
      email: registerEmail.value,
      password: registerPassword.value,
    });

    if (response.data.success) {
      toast.success('Registrazione riuscita. Ora puoi effettuare il login');
      isRegistering.value = false; // Passa al modulo di login
    } else {
      toast.error('Registrazione fallita');
    }
  } catch (error) {
    toast.error('Errore durante la registrazione');
    console.error(error);
  }
};

const onLogout = () => {
  userStore.clearUser(); // Pulisci i dati dell'utente nello store
  toast.success('Logout riuscito');
  router.push('/'); // Reindirizza alla pagina di login (o a un'altra pagina di tua scelta)
};

const toggleForm = () => {
  isRegistering.value = !isRegistering.value;
};
</script>
