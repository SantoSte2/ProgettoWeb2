import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    clearUser() {
      this.user = null;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,

    userId: (state) => state.user?.idUtente,

    username: (state) => state.user?.username,

    isLibr: (state) => state.user?.isLibr
  },
});
