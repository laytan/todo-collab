<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-name"
      @click="openEditing"
    >{{ text }}</div>
    <div v-show="editing">
      <input class="input-field inline" type="text" v-model="text" />
      <button @click="save" class="waves-effect waves-green green-text btn-flat">Save</button>
      <button @click="cancel" class="waves-effect waves-red red-text btn-flat">Cancel</button>
    </div>
  </div>
</template>
<script>
import { ref } from '@vue/composition-api';
import { useActions } from '@u3u/vue-hooks';
import EventBus from '../../event-bus';
import types from '../../types';

export default {
  props: {
    todoId: {
      type: String,
      required: true,
    },
    name: String,
  },
  setup(props) {
    const { CHANGE_TODO_NAME } = useActions([types.CHANGE_TODO_NAME]);

    const editing = ref(false);
    const text = ref(props.name.length > 0 ? props.name : 'Name...');

    function closeEditing() {
      setTimeout(() => {
        editing.value = false;
      }, 250);

      EventBus.$emit('set-draggable', true);
    }

    EventBus.$on('close-editing', () => {
      editing.value = false;
    });

    function openEditing() {
      EventBus.$emit('close-editing');
      EventBus.$emit('set-draggable', false);
      editing.value = true;
    }

    function save() {
      CHANGE_TODO_NAME({ todoId: props.todoId, name: text.value });
      closeEditing();
    }

    function cancel() {
      // TODO: implement
      closeEditing();
    }

    return {
      editing,
      save,
      cancel,
      text,
      openEditing,
    };
  },
};
</script>
<style lang="scss" scoped>
.todolist-item-name {
  font-weight: bold;
  margin: 0 0 .4rem 2rem;
}
</style>
