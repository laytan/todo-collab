<template>
  <div v-show="state.list" class="todo-list z-depth-2">
    <h2 class="name">
      {{ state.list.name }}
    </h2>
    <progress-bar v-if="state.list.items" :items="state.list.items"/>
    <draggable v-if="state.list.items" v-model="state.list.items" v-bind="draggableOptions">
      <transition-group type="transition" :name="'flip-list'">
        <div v-for="item in state.list.items" :key="item._id">
          <list-item :item-data="item"/>
        </div>
      </transition-group>
    </draggable>
    <div class="buttons flex between">
      <button class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">security</i>
      </button>
      <button @click="addItem"
      class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">add</i>
      </button>
      <button class="btn-floating btn-large waves-effect waves-light red lighten-3">
        <i class="material-icons">delete_forever</i>
      </button>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted } from '@vue/composition-api';
import { useState, useActions } from '@u3u/vue-hooks';
import draggable from 'vuedraggable';
import progressBar from './list/ProgressBar.vue';
import listItem from './list/ListItem.vue';
import EventBus from '../event-bus';
import types from '../types';

export default {
  components: {
    draggable,
    progressBar,
    listItem,
  },
  setup() {
    const { ADD_ITEM_TO_CURRENT_LIST } = useActions([types.ADD_ITEM_TO_CURRENT_LIST]);

    // TODO: add children event?
    const draggableOptions = reactive({
      disabled: false,
    });

    const state = reactive({
      list: {},
      // list: {
      //   name: 'Todo list 1',
      //   author: 'laytan1@hotmail.com',
      //   items: [
      //     {
      //       order: 1,
      //       id: 'asdasd',
      //       name: 'Buy Groceries',
      //       label: 'Dashboard bugs',
      //       description: 'Lorem ipsum dolor sit amet',
      //       color: 'rgba(255,0,0,1)',
      //       lastEditedAt: Date.now(),
      //       createdAt: Date.now(),
      //       doneAt: Date.now(),
      //       lastEditedBy: 'laytan1@hotmail.com',
      //       doneBy: null,
      //       done: false,
      //       author: 'laytanlaats@hotmail.com',
      //     },
      //     {
      //       order: 3,
      //       id: 'asdasxcxcd',
      //       name: 'Fix bugs',
      //       label: 'low prio',
      //       description: 'Lorem Ipsum is simply dummy text of the
      //       printing and typesetting industry.'
      //       + ' Lorem Ipsum has been the industry\'s standard ',
      //       color: 'rgba(0,255,0,1)',
      //       createdAt: Date.now(),
      //       lastEditedAt: Date.now(),
      //       doneAt: Date.now(),
      //       lastEditedBy: 'laytan@admin.nl',
      //       doneBy: null,
      //       done: false,
      //       author: 'laytanlaats@hotmail.com',
      //     },
      //     {
      //       order: 2,
      //       id: 'asdasasdd',
      //       name: 'brush your theeth',
      //       label: 'maybe',
      //       description: 'Lorem ipsum dolor sit amet',
      //       color: 'rgba(0,0,255,1)',
      //       createdAt: Date.now(),
      //       lastEditedAt: Date.now(),
      //       doneAt: Date.now(),
      //       lastEditedBy: 'laytan@admin.nl',
      //       doneBy: 'laytan@admin.nl',
      //       done: true,
      //       author: 'laytanlaats@hotmail.com',
      //     },
      //   ],
      // },
    });

    onMounted(async () => {
      const { currentList } = useState(['currentList']);
      state.list = currentList;
    });

    function addItem() {
      ADD_ITEM_TO_CURRENT_LIST();
    }

    EventBus.$on('set-draggable', (bool) => {
      draggableOptions.disabled = !bool;
    });

    return {
      state,
      draggableOptions,
      addItem,
    };
  },
};
</script>
<style lang="scss" scoped>
.todo-list {
  max-width: 400px;
  padding-bottom: 1.5rem;
  background: linear-gradient(50deg, #2196f3, #3f51b5);
}

.name {
  margin: 0 1.5rem;
  padding: 1.5rem 0 .5rem 0;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: #EF9A9A;
}

.flip-list-move {
  transition: transform .2s;
}

.buttons {
  margin: auto 1.5rem;
}
</style>
