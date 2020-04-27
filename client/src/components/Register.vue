<template>
  <form @submit.prevent="registerWithCreds">
    <h2>Register</h2>
    <div class="input-field">
      <input type="text" id="username" v-model="credentials.username" required>
      <label for="username" class="grey-text text-darken-4">Username</label>
    </div>
    <div class="input-field">
      <input v-model="credentials.email" id="email" type="email" required>
      <label for="email" class="grey-text text-darken-4">Email</label>
    </div>
    <div class="input-field">
      <input v-model="credentials.password" id="password" type="password" required>
      <label for="password" class="grey-text text-darken-4">Password</label>
    </div>
    <div class="row">
      <button class="btn waves-effect waves-light red col s12" type="submit" name="action">
        Register
      </button>
    </div>
  </form>
</template>

<script>
import { reactive } from 'vue';

import { useStore } from '@/store';
import { actions } from '@/types';

export default {
  setup() {
    const { dispatch } = useStore();

    const credentials = reactive({
      username: '',
      email: '',
      password: '',
    });

    async function registerWithCreds() {
      const res = await dispatch(actions.REGISTER, {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });

      if (res.error) {
        window.M.toast({
          html: res.error,
          classes: 'red',
          displayLength: 999999,
        });
        return;
      }

      credentials.username = '';
      credentials.email = '';
      credentials.password = '';
      window.M.toast({
        html: 'Account has been registered.',
        classes: 'green',
      });
    }

    return {
      credentials,
      registerWithCreds,
    };
  },
};
</script>

<style lang="scss" scoped>
input {
  border-bottom-color: #212121 !important;

  &:focus {
    border-bottom-color: #f44336 !important;

    & + label {
      color: #f44336 !important;
    }
  }
}
</style>
