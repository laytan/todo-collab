<template>
  <div ref="rootElement" class="authenticate">
    <div class="login">
      <transition name="slide-out-left">
        <div v-if="isViewLogin" class="half-width slide-from-left">
          <login></login>
        </div>
      </transition>
      <transition name="slide-out-right">
        <div v-if="!isViewLogin" class="slide-from-right">
          <h4 :style="{ whiteSpace: 'nowrap' }">Already have an account?</h4>
          <button class="btn waves-effect waves-light blue" @click="isViewLogin = true">
            Login!
          </button>
        </div>
      </transition>
    </div>
    <div class="register">
      <transition name="slide-out-right">
        <div v-if="!isViewLogin" class="half-width slide-from-right">
          <register></register>
        </div>
      </transition>
      <transition name="slide-out-left">
        <div v-if="isViewLogin" class="slide-from-left">
          <h4 :style="{ whiteSpace: 'nowrap' }">Don't have an account?</h4>
          <button class="btn waves-effect waves-light red" @click="isViewLogin = false">
            Sign up!
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';

export default {
  name: 'authentication',
  components: {
    Login,
    Register,
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

$animation-duration: .5s;

html {
  overflow: hidden;
}

.authenticate {
  max-width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 55% 45%;
  transition: grid-template-columns 0.5s ease;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  transition: all 0.5s;
  position: relative;
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
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
