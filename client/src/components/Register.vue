<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="registerWithCreds">
        <input type="email" placeholder="Email" v-model="credentials.email">
        <input type="password" placeholder="Password" v-model="credentials.password">
        <input type="submit" value="register">
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';

import { useStore } from '@/store';
import { actions } from '@/types';

export default {
  setup() {
    const { dispatch } = useStore();

    const credentials = reactive({
      email: '',
      password: '',
    });

    function registerWithCreds() {
      dispatch(actions.REGISTER, {
        email: credentials.email,
        password: credentials.password,
      });
    }

    return {
      credentials,
      registerWithCreds,
    };
  },
};
</script>
