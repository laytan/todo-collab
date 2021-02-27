<template>
  <div>
    <Error
      v-if="error.value.length"
      :dismissed="error.dismissed"
      :on-dismiss="() => (error.dismissed = true)"
      v-html="error.value"
    />
    <form @submit.prevent="registerWithCreds">
      <h2 class="text-red-400 h1">Register</h2>
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
import { useStore } from 'vuex';
import { models } from '@feathersjs/vuex';

import Button from '@/components/Button.vue';
import Error from '@/components/messages/Error.vue';

export default {
  components: {
    Button,
    Error,
  },
  setup() {
    const { dispatch } = useStore();
    const { User } = models.api;

    const credentials = reactive({
      username: '',
      email: '',
      password: '',
    });

    const error = reactive({
      dismissed: false,
      value: '',
    });

    async function registerWithCreds() {
      error.value = '';
      error.dismissed = false;

      try {
        await new User(credentials).save();
        await dispatch('auth/authenticate', {
          strategy: 'local',
          email: credentials.email,
          password: credentials.password,
        });
      } catch (err) {
        console.warn(err);
        error.value = err?.message ?? 'Something went wrong when signing you up, please try again.';
      } finally {
        credentials.username = '';
        credentials.email = '';
        credentials.password = '';
      }
    }

    return {
      credentials,
      registerWithCreds,
      error,
    };
  },
};
</script>
