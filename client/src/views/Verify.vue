<template>
  <div class="center">
    <div>
      <p v-if="!success && !error.length > 0">Verifying Email address...</p>
      <div v-if="success">
        <h2>Thank you for verifying your Email Address</h2>
        <p>You are good to go! Log in below and get your collaborations going!</p>
        <router-link to="/authentication" class="btn waves-effect waves-light red">
          Log in
        </router-link>
      </div>
      <Toast v-if="error.length > 0" :message="error" :time="999999" classes="red"></Toast>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from '@/router';
import { useStore } from '@/store';
import { actions } from '@/types';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    Toast,
  },
  setup() {
    const router = useRouter();
    const { token } = router.currentRoute.value.query;

    const { dispatch } = useStore();

    const success = ref(false);
    const error = ref('');

    if (!token) {
      error.value = 'No token found!';
    }

    onMounted(async () => {
      const res = await dispatch(actions.VERIFY_EMAIL, token);
      if (res.user?.isVerified) {
        success.value = true;
      } else {
        error.value = res.error;
      }
    });

    return {
      error,
      success,
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
</style>
