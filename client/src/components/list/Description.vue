<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-description"
      @click="openEditing"
    >{{ description }}</div>
    <div v-show="editing">
      <textarea ref="textarea" v-model="description" class="materialize-textarea">
      </textarea>
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
    description: String,
    todoId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { PATCH_ITEM } = useActions([types.PATCH_ITEM]);

    const editing = ref(false);
    const textarea = ref(null);

    function closeEditing() {
      EventBus.$emit('set-draggable', true);

      setTimeout(() => {
        editing.value = false;
      }, 250);
    }

    EventBus.$on('close-editing', () => {
      editing.value = false;
    });

    function openEditing() {
      EventBus.$emit('close-editing');
      EventBus.$emit('set-draggable', false);

      editing.value = true;
      window.M.textareaAutoResize(window.$(textarea.value));
    }

    function save() {
      PATCH_ITEM({ id: props.todoId, patchData: { description: props.description } });
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
      textarea,
    };
  },
};
</script>
<style lang="scss" scoped>
.todolist-item-description {
  font-size: 95%;
  text-align:justify;
  margin: 0 1rem 0 2rem;
}
</style>
