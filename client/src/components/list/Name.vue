<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-name"
      @click="openEditing"
    >{{ internalName }}</div>
    <div v-show="editing">
      <input @blur="cancel" class="input-field inline" type="text" v-model="internalName" />
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
    todoId: {
      type: String,
      required: true,
    },
    name: String,
  },
  setup(props, { emit }) {
    const { dispatch } = useStore();

    const editing = ref(false);
    const internalName = ref(props.name);

    function closeEditing() {
      setTimeout(() => {
        editing.value = false;
      }, 250);

      emit('on-editing-change', false);
    }

    function openEditing() {
      emit('on-editing-change', true);
      editing.value = true;
    }

    function save() {
      dispatch(actions.PATCH_ITEM, { id: props.todoId, patchData: { name: internalName.value } });
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
      internalName,
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
