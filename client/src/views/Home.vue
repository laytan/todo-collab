<template>
  <div class="home">
    <div class="hero white-text">
      <navigation/>
      <div class="row container valign-wrapper">
        <div class="col s4">
          <h1 class="red-text text-lighten-3">Todo Collab</h1>
          <p>
            Lorem ipsum dolor sit amet, bibendum a enim vitae, tempus scelerisque purus.
            Nunc vel eros elementum, feugiat magna viverra, placerat ante. Praesent non enim orci.
            Nullam vitae luctus quam.
          </p>
          <router-link v-if="user.email" to="/lists"
          class="waves-effect waves-light btn red-border">
            My todos
          </router-link>
          <router-link v-else to="/authentication" class="waves-effect waves-light btn red-border">
            Login / Register
          </router-link>
        </div>
        <div class="col s8">
          <div class="todo z-depth-4">
            <h2 class="red-text text-lighten-3">Features</h2>
            <ul>
              <li class="valign-wrapper section todo-item">
                <i class="material-icons no">check_box_outline_blank</i>
                <i class="material-icons yes">check_box</i>
                <span>Easy UI</span>
              </li>
              <div class="divider red lighten-3"></div>
              <li class="valign-wrapper section todo-item">
                <i class="material-icons no">check_box_outline_blank</i>
                <i class="material-icons yes">check_box</i>
                <span>Collaborate</span>
              </li>
              <div class="divider red lighten-3"></div>
              <li class="valign-wrapper section todo-item">
                <i class="material-icons no">check_box_outline_blank</i>
                <i class="material-icons yes">check_box</i>
                <span>Event trace</span>
              </li>
              <div class="divider red lighten-3"></div>
              <li class="valign-wrapper section todo-item">
                <i class="material-icons no">check_box_outline_blank</i>
                <i class="material-icons yes">check_box</i>
                <span>Free</span>
              </li>
              <div class="divider red lighten-3"></div>
            </ul>
            <div class="section progress-wrapper valign-wrapper">
              <div class="progress white">
                <div class="determinate green accent-3" style="width: 0%;"></div>
              </div>
              <span id="todo-progress">0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h1>Todo Collab</h1>
    <div class="container list-container">
      <todo-list></todo-list>
    </div>
    <div v-if="user.email">
      <h2>Create a todo!</h2>
      <create-todo></create-todo>
    </div>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import { useState } from '@u3u/vue-hooks';
import CreateTodo from '../components/CreateTodo.vue';
import Navigation from '../components/Navigation.vue';
import TodoList from '../components/TodoList.vue';


export default {
  name: 'home',
  components: {
    CreateTodo,
    Navigation,
    TodoList,
  },
  setup() {
    const { user } = useState(['user']);

    function todoAnimation() {
      // Get the checkboxes
      const yesBoxes = Array.from(document.querySelectorAll('.todo .yes'));
      const noBoxes = Array.from(document.querySelectorAll('.todo .no'));

      // Get the progress bar and progress text
      const progress = document.querySelector('.todo .determinate');
      const progressText = document.querySelector('#todo-progress');

      // Keep track of progress
      const { length } = yesBoxes;
      const parts = 100 / length;
      let i = 0;

      const interval = setInterval(() => {
        // Toggle a checkbox
        yesBoxes[i].style.display = 'block';
        noBoxes[i].style.display = 'none';

        // Calculate new percentage
        const width = `${(parts * (i + 1)).toFixed(0)}%`;
        progress.style.width = width;
        progressText.innerText = width;

        // Clearinterval if we are done
        if (i === length - 1) {
          clearInterval(interval);
        }

        i += 1;
      }, 1000);
    }

    onMounted(() => {
      setTimeout(todoAnimation, 500);
    });

    return {
      user,
    };
  },
};
</script>
<style lang="scss" scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(50deg, #2196f3, #3f51b5);

  .navigation {
    height: 10vh;
  }

  .row {
    height: 90vh;
  }
}

.todo {
  padding-right: 2rem;
  padding-left: 2rem;
  padding-top: 1rem;
  max-width: 60%;
  height: 100%;
  margin-left: auto;
}

.todo-item {
  padding-right: 2rem;

  span {
    padding-left: 1.5rem;
  }
}

.yes {
  display: none;
}

.progress-wrapper {
  display: flex;

  .progress {
    margin: 0 1rem 0 0;
  }
}

.list-container {
  margin-bottom: 5rem;
}
</style>
