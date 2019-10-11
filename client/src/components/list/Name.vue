<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-name"
      @click="openEditing"
    >{{ name }}</div>
    <div v-show="editing">
      <input class="input-field inline" type="text" v-model="name" />
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
    const { PATCH_ITEM } = useActions([types.PATCH_ITEM]);

    const editing = ref(false);

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
      PATCH_ITEM({ id: props.todoId, patchData: { name: props.name } });
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
