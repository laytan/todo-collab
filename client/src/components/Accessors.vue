<template>
  <h3 class="block mt-4 text-sm text-gray-600">People who have access</h3>
  <ul>
    <li class="pb-2 border-b border-gray-400" v-for="accessor in accessors" :key="accessor.id">
      <span>
        {{ accessor.user.username }}
        <small v-if="accessor.user_id === ownerId"> - Owner</small>
      </span>
      <small class="block text-gray-600"> Since {{ formatDate(accessor.created_at) }}</small>
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue';
import { useFind, models } from '@feathersjs/vuex';

import { formatDate } from '@/helpers';

export default {
  props: {
    listId: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { UserHasAccess, User } = models.api;

    const { items: accessors } = useFind({
      model: UserHasAccess,
      params: {
        query: {
          $sort: { created_at: -1 },
          list_id: props.listId,
        },
      },
    });

    const loadedAccessors = computed(() => accessors.value.length);

    const findAccessorsParams = computed(() => ({
      query: {
        id: {
          $in: [...new Set(accessors.value.map((accessor) => accessor.user_id))],
        },
      },
    }));

    const { items: accessorUsers } = useFind({
      queryWhen: loadedAccessors,
      model: User,
      params: findAccessorsParams,
    });

    const accessorsWithUser = computed(
      () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        accessors.value.map((accessor) => ({
          ...accessor,
          user: accessorUsers.value.find((user) => user.id === accessor.user_id),
        })),
      // eslint-disable-next-line function-paren-newline
    );

    return { formatDate, accessors: accessorsWithUser };
  },
};
</script>
