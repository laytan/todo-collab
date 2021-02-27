<template>
  <div>
    <Error
      v-if="error.value.length"
      :dismissed="error.dismissed"
      :on-dismiss="() => (error.dismissed = true)"
      >{{ error.value }}</Error
    >
    <form @submit.prevent="loginWithCreds">
      <h2 class="text-red-400 h1">Login</h2>

      <label for="email">Email</label>
      <input v-model="credentials.email" id="email" type="email" required />

      <label for="password">Password</label>
      <input v-model="credentials.password" id="password" type="password" required />

      <router-link class="block text-sm text-right" to="/reset">Forgot Password?</router-link>

      <Button type="submit" name="action">
        Login
      </Button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore } from 'vuex';

import { useRouter } from '@/router';
import { redirectedFromOr } from '@/helpers';
import { actions } from '@/types';

import Button from './Button.vue';
import Error from './messages/Error.vue';

export default {
  components: {
    Button,
    Error,
  },
  setup() {
    const dispatch = useStore();

    const credentials = reactive({
      email: '',
      password: '',
    });

    const error = reactive({
      dismissed: false,
      value: '',
    });

    async function loginWithCreds() {
      error.value = '';
      error.dismissed = false;

      const errOrUser = await dispatch(actions.LOGIN_WITH_CREDENTIALS, {
        email: credentials.email,
        password: credentials.password,
      });

      if (errOrUser.error) {
        error.value = errOrUser.error;
        return;
      }

      // Logged in
      redirectedFromOr('/', useRouter());
    }

    return {
      credentials,
      loginWithCreds,
      error,
    };
  },
};
</script>
