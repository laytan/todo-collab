<template>
  <div>
    <div
      v-show="!editing"
      class="todolist-item-name"
      @click="openEditing"
    >{{ internalName }}</div>
    <div v-show="editing">
      <input @blur="save" class="input-field inline" type="text" v-model="internalName" />
      <button @click="save" class="waves-effect waves-green green-text btn-flat">Save</button>
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
      type: Number,
      required: true,
    },
    name: String,
  },
  setup(props) {
    const { dispatch } = useStore();

    const editing = ref(false);
    const internalName = ref(props.name);

    function closeEditing() {
      setTimeout(() => {
        editing.value = false;
      }, 250);
    }

    function openEditing() {
      editing.value = true;
    }

    function save() {
      dispatch(actions.PATCH_ITEM, { id: props.todoId, patchData: { name: internalName.value } });
      closeEditing();
    }

    return {
      editing,
      save,
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
