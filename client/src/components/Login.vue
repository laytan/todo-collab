<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="loginWithCreds">
        <input type="email" placeholder="Email" v-model="state.email">
        <input type="password" placeholder="Password" v-model="state.password">
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
    });

    function loginWithCreds() {
      LOGIN_WITH_CREDENTIALS({
        email: state.email,
        password: state.password,
      });
    }

    return {
      state,
      loginWithCreds,
    };
  },
};
</script>
