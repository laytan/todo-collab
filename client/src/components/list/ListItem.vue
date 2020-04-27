<template>
  <div :data-id="itemData.id" class="todolist-item section z-depth-2">
    <item-label :label-color="itemData.color" :label-text="itemData.label" />
    <div class="todolist-item-body">
      <name :todoId="itemData.id" :name="itemData.name"/>
      <description
        :todoId="itemData.id"
        :description="itemData.description"
      />
      <div class="item-details" @click="showMore = !showMore">
        <item-detail
        v-if="itemData.completed_at"
        :date="itemData.completed_at" :user="itemData.done_by" icon="check" tooltip="Completed" />
      </div>
    </div>
    <div class="checkbox-wrapper flex column between">
      <label>
        <input type="checkbox" class="filled-in" :checked="itemData.completed_at"
        @click="toggleDone" />
          <!-- This span is required -->
        <span class="checkbox-span"></span>
      </label>
      <i @click="removeItem" class="material-icons red-text remove">delete_forever</i>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';

import { useStore } from '@/store';
import { actions } from '@/types';

import itemLabel from '@/components/list/ItemLabel.vue';
import name from '@/components/list/Name.vue';
import description from '@/components/list/Description.vue';
import itemDetail from '@/components/list/ItemDetail.vue';

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
    const { dispatch } = useStore();

    const showMore = ref(false);

    // TODO: implement
    function removeItem() {
    }

    async function toggleDone() {
      props.itemData.completed_at = props.itemData.completed_at ? null : new Date();

      dispatch(actions.PATCH_ITEM, {
        id: props.itemData.id,
        patchData: {
          completed: !!props.itemData.completed_at,
        },
      });
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
