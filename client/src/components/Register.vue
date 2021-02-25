<template>
  <div>
    <Error
      v-if="error.value.length"
      :dismissed="error.dismissed"
      :on-dismiss="() => (error.dismissed = true)"
      v-html="error.value"
    />
    <Success
      v-if="success.value.length"
      :dismissed="success.dismissed"
      :on-dismiss="() => (success.dismissed = true)"
      >{{ success.value }}</Success
    >
    <form @submit.prevent="registerWithCreds">
      <h2 class="h1 text-red-400">Register</h2>
      <label for="username">Username</label>
      <input type="text" id="username" v-model="credentials.username" required />

      <label for="email">Email</label>
      <input v-model="credentials.email" id="email" type="email" required />

      <label for="password">Password</label>
      <input v-model="credentials.password" id="password" type="password" required />

      <Button type="submit" name="action" class="mt-2">
        Register
      </Button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';

import { useStore } from '@/store';
import { actions } from '@/types';

import Button from '@/components/Button.vue';
import Error from '@/components/messages/Error.vue';
import Success from '@/components/messages/Success.vue';

export default {
  components: {
    Button,
    Error,
    Success,
  },
  setup() {
    const { dispatch } = useStore();

    const credentials = reactive({
      username: '',
      email: '',
      password: '',
    });

    const error = reactive({
      dismissed: false,
      value: '',
    });

    const success = reactive({
      dismissed: false,
      value: '',
    });

    async function registerWithCreds() {
      error.value = '';
      error.dismissed = false;
      success.value = '';
      success.dismissed = false;

      const res = await dispatch(actions.REGISTER, {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      });

      if (res.error) {
        console.warn(res.error);
        error.value = res.error;
        return;
      }

      credentials.username = '';
      credentials.email = '';
      credentials.password = '';
      success.value = 'Account has been registered.';
    }

    return {
      credentials,
      registerWithCreds,
      error,
      success,
    };
  },
};
</script>
