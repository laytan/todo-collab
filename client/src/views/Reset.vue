<template>
  <div class="center">
    <div v-if="token">
      <div v-if="hasReset">
        <h2>Your Password has been Reset</h2>
        <p>
          Your password has been reset. You can now log in below and start collaborating!
        </p>
        <router-link to="/authentication" class="btn waves-effect waves-light">Log in</router-link>
      </div>
      <div v-else>
        <h2>Reset Your Password</h2>
        <p>
          Almost recovered, pfew! Enter a new Password below.
        </p>
        <form @submit.prevent="resetPassword">
          <div class="input-field">
            <input type="password" id="new-password" v-model="newPassword">
            <label for="new-password">New Password</label>
            <div class="input-field row">
              <button type="submit" class="btn waves-effect waves-light col s12">
                Set new Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-else>
      <div v-if="hasSent">
        <h2>An Email has been sent</h2>
        <p>
          An email has been sent to {{ email }} with a link to reset your password.
        </p>
      </div>
      <div v-else>
        <h2>Reset Your Password</h2>
        <p>
          Forgot your password?
          No problem, enter your email below and we will send you a reset link.
        </p>
        <form @submit.prevent="sendResetPasswordEmail">
          <div class="input-field">
            <input type="email" id="email" v-model="email">
            <label for="email">Email</label>
          </div>
          <div class="input-field row">
            <button type="submit" class="btn waves-effect waves-light col s12">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { actions } from '@/types';

export default {
  setup() {
    const newPassword = ref('');
    const email = ref('');

    const hasReset = ref(false);
    const hasSent = ref(false);

    const { dispatch } = useStore();

    const router = useRouter();
    const token = ref('');
    onMounted(() => {
      token.value = router.currentRoute.value.query.token;
    });

    function sendResetPasswordEmail() {
      dispatch(actions.SEND_RESET_PASSWORD, email.value);
      hasSent.value = true;
    }

    function resetPassword() {
      dispatch(actions.RESET_PASSWORD, { token: token.value, password: newPassword.value });
      hasReset.value = true;
    }

    return {
      email,
      sendResetPasswordEmail,
      token,
      newPassword,
      resetPassword,
      hasReset,
      hasSent,
    };
  },
};
</script>

<style lang="scss" scoped>
.center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  margin-top: 2rem;
}

.input-field {
  max-width: 400px;
  margin: 1rem auto;
}
</style>
