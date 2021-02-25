<template>
  <div ref="rootElement" class="authenticate h-screen grid">
    <div class="flex items-center justify-center px-1 relative transition-all delay-500">
      <transition name="slide-out-left">
        <div v-if="isViewLogin" class="w-1/2 slide-from-left">
          <login></login>
        </div>
      </transition>
      <transition name="slide-out-right">
        <div v-if="!isViewLogin" class="slide-from-right">
          <h2 class="h2 whitespace-nowrap">Already have an account?</h2>
          <Button @click="isViewLogin = true">Login!</Button>
        </div>
      </transition>
    </div>
    <div class="register flex items-center justify-center">
      <transition name="slide-out-right">
        <div v-if="!isViewLogin" class="w-1/2 slide-from-right">
          <register></register>
        </div>
      </transition>
      <transition name="slide-out-left">
        <div v-if="isViewLogin" class="slide-from-left">
          <h2 class="h2 whitespace-nowrap">Don't have an account?</h2>
          <Button @click="isViewLogin = false">
            Sign up!
          </Button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Button from '@/components/Button.vue';

export default {
  name: 'authentication',
  components: {
    Login,
    Register,
    Button,
  },
  setup() {
    const rootElement = ref(null);
    const isViewLogin = ref(true);

    function slideInRegister() {
      rootElement.value.style.gridTemplateColumns = '30% 70%';
    }

    function slideInLogin() {
      rootElement.value.style.gridTemplateColumns = '55% 45%';
    }

    watch(isViewLogin, (newIsViewLogin) => {
      if (newIsViewLogin) {
        slideInLogin();
      } else {
        slideInRegister();
      }
    });

    return {
      rootElement,
      isViewLogin,
    };
  },
};
</script>
<style lang="scss">
$animation-duration: 0.5s;

html {
  overflow: hidden;
}

.authenticate {
  max-width: 100vw;
  grid-template-columns: 55% 45%;
  transition: grid-template-columns 0.5s ease;
}

.register {
  background: linear-gradient(50deg, #2196f3, #3f51b5);
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 0% 100%);

  .slide-from-right {
    width: 25%;
    right: 12.5%;
    left: 62.5%;
  }

  .slide-from-left {
    left: calc(70% + 1rem);
  }
}

.slide-out-left-enter-active,
.slide-out-left-leave-active,
.slide-out-right-enter-active,
.slide-out-right-leave-active {
  transition: transform $animation-duration;
}

.slide-out-left-leave-to {
  transform: translateX(-500%);
}

.slide-out-right-leave-to {
  transform: translateX(500%);
}

.slide-from-right {
  animation: slide-from-right $animation-duration;
  position: absolute;
}

@keyframes slide-from-right {
  from {
    transform: translateX(500%);
  }
}

.slide-from-left {
  animation: slide-from-left $animation-duration;
  position: absolute;
}

@keyframes slide-from-left {
  from {
    transform: translateX(-500%);
  }
}
</style>
