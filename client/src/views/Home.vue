<template>
  <div class="home">
    <div>
      <navigation />
      <div class="from-blue-600 to-blue-400 bg-gradient-to-tr">
        <div class="container grid h-screen grid-cols-2 gap-6 p-2 mx-auto place-items-center">
          <div class="max-w-md">
            <h1 class="mb-4 text-6xl text-red-300">Todo Collab</h1>
            <p class="mb-3 text-lg text-white">
              Lorem ipsum dolor sit amet, bibendum a enim vitae, tempus scelerisque purus. Nunc vel
              eros elementum, feugiat magna viverra, placerat ante. Praesent non enim orci. Nullam
              vitae luctus quam.
            </p>
            <Button v-if="user">
              <router-link class="text-white hover:no-underline" to="/lists">
                My todos
              </router-link>
            </Button>
            <Button v-else>
              <router-link class="text-white hover:no-underline" to="/authentication">
                Login / Register
              </router-link>
            </Button>
          </div>
          <div>
            <div class="p-8 pt-8 shadow-xl todo">
              <h2 class="mb-6 text-6xl text-red-300">Features</h2>
              <ul class="text-xl text-white">
                <li
                  style="min-width: 20vw;"
                  class="flex items-center gap-8 py-2 border-b border-red-300"
                  v-for="item in todoItems"
                  :key="item.text"
                >
                  <input
                    class="text-red-400 rounded"
                    type="checkbox"
                    :checked="item.checked"
                    disabled
                  />
                  {{ item.text }}
                </li>
              </ul>
              <div class="flex items-center gap-2 mt-4 text-white">
                <span class="relative block w-full h-2 bg-gray-200 rounded custom-range">
                  <span
                    :style="`width: ${percentageChecked}%;`"
                    class="block h-2 transition-all bg-green-500 rounded custom-range__filled"
                  ></span>
                </span>
                <span> {{ percentageChecked }}% </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

import { mapState } from '@/store';
import Navigation from '@/components/Navigation.vue';
import Button from '@/components/Button.vue';

export default {
  name: 'home',
  components: {
    Navigation,
    Button,
  },
  setup() {
    const user = mapState('auth.user');

    const todoItems = ref([
      {
        text: 'Easy UI',
        checked: false,
      },
      {
        text: 'Collaborate',
        checked: false,
      },
      {
        text: 'Event Trace',
        checked: false,
      },
      {
        text: 'Free',
        checked: false,
      },
    ]);

    const percentageChecked = ref(0);

    function checkNextTodo() {
      let done = false;
      todoItems.value.forEach((item) => {
        if (done) return;
        if (item.checked) return;
        item.checked = true;
        done = true;
        percentageChecked.value += 100 / todoItems.value.length;
      });
      if (done) setTimeout(checkNextTodo, 1000);
    }

    onMounted(() => {
      setTimeout(checkNextTodo, 500);
    });

    return {
      user,
      todoItems,
      percentageChecked,
    };
  },
};
</script>
