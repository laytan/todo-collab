<template>
  <h3 class="block mt-4 text-sm text-gray-600">Gebeurtenissen</h3>
  <ul>
    <Event v-for="event in events" :key="event.id" :event="event" />
  </ul>
</template>

<script>
import { computed, watch } from 'vue';
import { useFind, models } from '@feathersjs/vuex';

import Event from './Event.vue';

export default {
  components: {
    Event,
  },
  props: {
    listId: {
      type: Number,
      required: true,
    },
    listItems: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const { Event: EventModel, User } = models.api;

    // Find events for the list and its items
    const findEventsParams = computed(() => ({
      query: {
        $sort: { created_at: -1 },
        $or: [
          {
            service: 'todo-lists',
            id_in_service: props.listId,
          },
          {
            service: 'todos',
            id_in_service: {
              $in: props.listItems.map((item) => item.id),
            },
          },
        ],
      },
    }));

    const { items: events, find } = useFind({
      model: EventModel,
      params: findEventsParams,
    });

    // When an item is updated, find manually because feathers-vuex does not think we need to find
    // Without this, the events would not update when an item is completed or something like that
    watch(
      props.listItems,
      () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        find({
          model: EventModel,
          params: findEventsParams,
        }),
      // eslint-disable-next-line function-paren-newline
    );

    const loadedEvents = computed(() => events.length);

    const findEventEmittersParams = computed(() => ({
      query: {
        id: {
          $in: [...new Set(events.value.map((event) => event.emitter_id))],
        },
      },
    }));

    const { items: eventEmitters } = useFind({
      queryWhen: loadedEvents,
      model: User,
      params: findEventEmittersParams,
    });

    const eventsWithEmitters = computed(
      () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        events.value.map((event) => ({
          ...event,
          emitter: eventEmitters.value.find((user) => user.id === event.emitter_id),
        })),
      // eslint-disable-next-line function-paren-newline
    );

    return { events: eventsWithEmitters };
  },
};
</script>
