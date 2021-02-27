<template>
  <div>
    <Error
      v-if="error && !error.message.includes('found in storage')"
      :dismissed="errorDismissed"
      :on-dismiss="() => (errorDismissed = true)"
      >{{ error.message }}</Error
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
import { reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { mapState } from '@/store';
import { mutations } from '@/types';

import Button from './Button.vue';
import Error from './messages/Error.vue';

export default {
  components: {
    Button,
    Error,
  },
  setup() {
    const { dispatch, commit } = useStore();

    const credentials = reactive({
      email: '',
      password: '',
    });

    const errorDismissed = ref(false);

    const [error, loading] = mapState(['auth.errorOnAuthenticate', 'auth.isAuthenticatePending']);
    watch(loading, (newLoading) => commit(mutations.SET_LOADING, newLoading));

    function loginWithCreds() {
      errorDismissed.value = false;
      dispatch('auth/authenticate', { ...credentials, strategy: 'local' }).catch(() => {});
    }

    return {
      credentials,
      loginWithCreds,
      errorDismissed,
      error,
    };
  },
};
</script>
