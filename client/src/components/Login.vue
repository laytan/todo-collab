<template>
  <form @submit.prevent="loginWithCreds">
      <h2>Login</h2>
      <div class="input-field">
        <input v-model="credentials.email" id="email" type="text">
        <label for="email">Email</label>
      </div>
      <div class="input-field">
        <input v-model="credentials.password" id="password" type="password">
        <label for="password">Password</label>
      </div>
      <p class="right-align">
        <router-link to="/reset">Forgot Password?</router-link>
      </p>
      <div class="row">
        <button class="btn waves-effect waves-light blue col s12" type="submit" name="action">
          Login
        </button>
      </div>
      <p class="red-text" v-if="error.length > 0">{{ error }}</p>
  </form>
</template>

<script>
import { reactive, ref } from 'vue';

import { useStore } from '@/store';
import { useRouter } from '@/router';
import { redirectedFromOr } from '@/helpers';
import { actions } from '@/types';

export default {
  setup() {
    const { dispatch } = useStore();

    const credentials = reactive({
      email: '',
      password: '',
    });

    const error = ref('');

    async function loginWithCreds() {
      error.value = '';

      const errOrUser = await dispatch(actions.LOGIN_WITH_CREDENTIALS, {
        email: credentials.email,
        password: credentials.password,
      });

      if (errOrUser.error) {
        error.value = errOrUser.error.message;
        return;
      }

      // Logged in
      redirectedFromOr('/', useRouter());
    }

    return {
      credentials,
      error,
      loginWithCreds,
    };
  },
};
</script>
