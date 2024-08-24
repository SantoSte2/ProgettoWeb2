import './assets/style.css'

import { createApp, ref } from 'vue'

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue'

import { createPinia } from 'pinia';


import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(Toast);
app.use(router)
app.use(pinia);

app.mount('#app')
