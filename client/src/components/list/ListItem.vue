<template>
  <div class="todolist-item section z-depth-2">
    <item-label :label-color="itemData.color" :label-text="itemData.label" />
    <div class="todolist-item-body">
      <name :todoId="itemData._id" :name="itemData.name"/>
      <description :todoId="itemData._id" :description="itemData.description" />
      <div class="item-details" @click="showMore = !showMore">
        <item-detail
        v-if="itemData.done"
        :date="itemData.doneAt" :user="itemData.doneBy" icon="check" tooltip="Completed" />
        <item-detail
        v-if="showMore || !itemData.done"
        :date="itemData.lastEditedAt"
        :user="itemData.lastEditedBy"
        icon="edit" tooltip="Last edit" />
        <item-detail
        v-if="showMore"
        :date="itemData.createdAt" :user="itemData.author" icon="add" tooltip="Created" />
      </div>
    </div>
    <div class="checkbox-wrapper flex column between">
      <label>
        <input type="checkbox" class="filled-in" :checked="itemData.done"
        @click="toggleDone" />
          <!-- This span is required -->
        <span class="checkbox-span"></span>
      </label>
      <i @click="removeItem" class="material-icons red-text remove">delete_forever</i>
    </div>
  </div>
</template>
<script>
import { ref } from '@vue/composition-api';
import { useActions } from '@u3u/vue-hooks';
import types from '../../types';

import itemLabel from './ItemLabel.vue';
import name from './Name.vue';
import description from './Description.vue';
import itemDetail from './ItemDetail.vue';

export default {
  components: {
    itemLabel,
    name,
    description,
    itemDetail,
  },
  props: {
    itemData: {
      required: true,
    },
  },
  setup(props) {
    const { PATCH_ITEM } = useActions([types.PATCH_ITEM]);

    const showMore = ref(false);

    // TODO: implement
    function removeItem() {
      console.log(props.itemData);
    }

    async function toggleDone() {
      props.itemData.done = !props.itemData.done;

      PATCH_ITEM({ id: props.itemData._id, patchData: { done: props.itemData.done } });
    }

    return {
      showMore,
      removeItem,
      toggleDone,
    };
  },
};
</script>
<style lang="scss" scoped>
.todolist-item {
  display: flex;
  padding: 0;
  margin: 1.5rem;
  background: rgba(255,255,255,0.85);
}

.item-details {
  margin-top: 1rem;
  background-color: rgba(255, 255, 255, 0.247);

  > div {
    margin: .5rem 0;
  }
}

.checkbox-wrapper {
  margin: .5rem 0 .5rem auto;
}

.todolist-item-body {
  margin: 0.5rem 0.5rem 0 1rem;

  // Occupy 100% but shrink when space is needed
  flex-shrink: 100;
  flex-basis: 100%;
}

.remove {
  margin-left: -2.5px;
}
</style>
