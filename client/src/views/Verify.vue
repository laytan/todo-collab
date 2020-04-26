<template>
  <div class="center">
    <div>
      <p v-if="!success">Verifying Email address...</p>
      <div v-else>
        <h2>Thank you for verifying your Email Address</h2>
        <p>You are good to go! Log in below and get your collaborations going!</p>
        <router-link to="/authentication" class="btn waves-effect waves-light red">
          Log in
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from '@/router';
import { useStore } from '@/store';
import { actions } from '@/types';

export default {
  setup() {
    const router = useRouter();
    const { token } = router.currentRoute.value.query;

    const { dispatch } = useStore();

    const success = ref(false);

    if (token) {
      onMounted(async () => {
        const res = await dispatch(actions.VERIFY_EMAIL, token);
        if (res.user?.isVerified) {
          success.value = true;
        } else {
          window.M.toast({
            html: res.error,
            classes: 'red',
          });
        }
      });
    } else {
      window.M.toast({
        html: 'No token found in URL.',
        classes: 'red',
      });
    }

    return {
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
