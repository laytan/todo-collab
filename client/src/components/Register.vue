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
import store from '../store';
import types from '../types';

export default {
  setup() {
    const { dispatch } = store;

    const credentials = reactive({
      email: '',
      password: '',
    });

    function registerWithCreds() {
      dispatch(types.REGISTER, {
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
