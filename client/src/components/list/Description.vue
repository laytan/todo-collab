<template>
  <div>
    <div v-show="!editing" class="todolist-item-description" @click="openEditing">
      {{ internalDescription }}
    </div>
    <div v-show="editing">
      <textarea
        @blur="save"
        ref="textarea"
        v-model="internalDescription"
        class="materialize-textarea"
      >
      </textarea>
      <button @click="save" class="waves-effect waves-green green-text btn-flat">Save</button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

import { actions } from '@/types';

export default {
  props: {
    description: String,
    todoId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const dispatch = useStore();

    const editing = ref(false);
    const textarea = ref(null);
    const internalDescription = ref(props.description);

    function closeEditing() {
      setTimeout(() => {
        editing.value = false;
      }, 250);
    }

    function openEditing() {
      editing.value = true;
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

    return {
      editing,
      save,
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
  text-align: justify;
  margin: 0 1rem 0 2rem;
}
</style>
