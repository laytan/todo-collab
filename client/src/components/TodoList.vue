<template>
  <div v-show="list" class="todo-list z-depth-2">
    <h2 class="name">
      {{ list.name }}
    </h2>
      <progress-bar v-if="list.items" :items="list.items"/>
    <!-- <draggable v-if="list.items" v-model="list.items" v-bind="draggableOptions"> -->
      <transition-group type="transition" :name="'flip-list'">
        <list-item v-for="item in list.items" :key="item._id" :item-data="item"/>
      </transition-group>
    <!-- </draggable> -->
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
import { reactive } from 'vue';
// FIXME: Draggable does not support vue 3.0 yet
// import draggable from 'vuedraggable';
import progressBar from './list/ProgressBar.vue';
import listItem from './list/ListItem.vue';
import types from '../types';
import store from '../store';

export default {
  components: {
    // FIXME: Draggable does not support vue 3.0 yet
    // draggable,
    progressBar,
    listItem,
  },
  props: {
    list: {
      required: true,
    },
  },
  setup(props) {
    const { dispatch } = store;

    // TODO: add children event?
    const draggableOptions = reactive({
      disabled: false,
    });

    function addItem() {
      dispatch(types.ADD_ITEM_TO_LIST, props.list._id);
    }
    // TODO: Rewrite event bus logic
    // EventBus.$on('set-draggable', (bool) => {
    //   draggableOptions.disabled = !bool;
    // });

    return {
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
