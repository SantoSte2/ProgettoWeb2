import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
// da sbloccare About solo se si vuole mappare la rotta con caricamento pigro
//import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/ListaLibri',
      name: 'ListaLibri',
      component: () => import('../views/ListaLibri.vue')
    },
    {
      path: '/AddLibro',
      name: 'AddLibro',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // questa riga sotto serve a caricare solo la pagina selizionata per evitare il CARICAMENTO LENTO  dovuto a troppi componenti della pagina o a progetti di pagina troppo grossi
      // definisco una funzione anonima (asincrona in questi casi) per caricare solo la pagina selezionata
      component: () => import('../views/AddLibro.vue')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    }
  ]
})

export default router
