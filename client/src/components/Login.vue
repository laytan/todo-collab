<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="loginWithCreds">
        <input type="email" placeholder="Email" v-model="credentials.email">
        <input type="password" placeholder="Password" v-model="credentials.password">
        <p class="red-text" v-if="error.length > 0">{{ error }}</p>
        <input type="submit" value="login">
    </form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import store from '../store';
import types from '../types';

export default {
  setup() {
    const { dispatch } = store;

    const credentials = reactive({
      email: '',
      password: '',
    });

    const error = ref('');

    async function loginWithCreds() {
      error.value = '';

      const errOrUser = await dispatch(types.LOGIN_WITH_CREDENTIALS, {
        email: credentials.email,
        password: credentials.password,
      });

      if (errOrUser.error) {
        error.value = errOrUser.error.message;
      }
    }

    return {
      credentials,
      error,
      loginWithCreds,
    };
  },
};
</script>
