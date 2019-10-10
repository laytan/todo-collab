<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="loginWithCreds">
        <input type="email" placeholder="Email" v-model="state.email">
        <input type="password" placeholder="Password" v-model="state.password">
        <p class="red-text" v-if="state.error.length > 0">{{ state.error }}</p>
        <input type="submit" value="login">
    </form>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api';
import { useActions } from '@u3u/vue-hooks';
import types from '../types';

export default {
  setup() {
    const { LOGIN_WITH_CREDENTIALS } = useActions([types.LOGIN_WITH_CREDENTIALS]);

    const state = reactive({
      email: '',
      password: '',
      error: '',
    });

    async function loginWithCreds() {
      state.error = '';

      const errOrUser = await LOGIN_WITH_CREDENTIALS({
        email: state.email,
        password: state.password,
      });

      if (errOrUser.error) {
        state.error = errOrUser.error.message;
      }
    }

    return {
      state,
      loginWithCreds,
    };
  },
};
</script>
