<template>
  <form @submit.prevent="registerWithCreds">
    <h2>Register</h2>
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
import { useRouter } from '@/router';
import { actions } from '@/types';
import { redirectedFromOr } from '@/helpers';

export default {
  setup() {
    const { dispatch } = useStore();

    const credentials = reactive({
      email: '',
      password: '',
    });

    async function registerWithCreds() {
      const res = await dispatch(actions.REGISTER, {
        email: credentials.email,
        password: credentials.password,
      });

      if (res.error) {
        window.M.toast({
          html: res.error,
          classes: 'red',
        });
        return;
      }

      redirectedFromOr('/', useRouter());
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
