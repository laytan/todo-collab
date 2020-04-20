<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-description"
      @click="openEditing"
    >{{ description }}</div>
    <div v-show="editing">
      <textarea
        @blur="cancel"
        ref="textarea"
        v-model="internalDescription"
        class="materialize-textarea"
      >
      </textarea>
      <button @click="save" class="waves-effect waves-green green-text btn-flat">Save</button>
      <button @click="cancel" class="waves-effect waves-red red-text btn-flat">Cancel</button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';

import { useStore } from '@/store';
import { actions } from '@/types';

export default {
  props: {
    description: String,
    todoId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { dispatch } = useStore();

    const editing = ref(false);
    const textarea = ref(null);
    const internalDescription = ref(props.description);

    function closeEditing() {
      emit('on-editing-change', false);

      setTimeout(() => {
        editing.value = false;
      }, 250);
    }

    function openEditing() {
      emit('on-editing-change', true);

      editing.value = true;
      window.M.textareaAutoResize(window.$(textarea.value));
    }

    function save() {
      dispatch(actions.PATCH_ITEM, {
        id: props.todoId,
        patchData: {
          description: internalDescription.value,
        },
      });
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
      internalDescription,
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
