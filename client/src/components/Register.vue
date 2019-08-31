<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="registerWithCreds">
        <input type="email" placeholder="Email" v-model="state.email">
        <input type="password" placeholder="Password" v-model="state.password">
        <input type="submit" value="register">
    </form>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api';
import { useActions } from '@u3u/vue-hooks';
import types from '../types';

export default {
  setup() {
    const { REGISTER } = useActions([types.REGISTER]);

    const state = reactive({
      email: '',
      password: '',
    });

    function registerWithCreds() {
      REGISTER({
        email: state.email,
        password: state.password,
      });
    }

    return {
      state,
      registerWithCreds,
    };
  },
};
</script>
