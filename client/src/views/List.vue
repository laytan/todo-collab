<template>
  <div>
    <Navigation class="mb-6" />
    <div v-if="list" class="container px-2 mx-auto">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-end gap-4">
          <h1 class="text-4xl text-red-400">{{ list.name }}</h1>
          <label class="text-sm">
            <input v-model="showCompleted" class="w-3 h-3" type="checkbox" />
            Show completed
          </label>
        </div>
        <!-- TODO: Modal or something -->
        <button @click="createTask" class="text-blue-500 hover:underline">New Item</button>
      </div>
      <div class="flex gap-12 p-4 bg-gray-100 shadow">
        <ul class="flex-grow">
          <li
            class="flex items-center gap-6 py-2 border-b border-gray-400"
            v-for="item in sorteditems"
            :key="item.id"
          >
            <!-- TODO: Show who completed the item -->
            <input type="checkbox" disabled :checked="item.completed_at !== null" />
            <div class="flex-grow">
              <div class="flex items-center justify-between">
                <div class="flex items-end gap-4 mb-1">
                  <h2 class="text-2xl">
                    {{ item.name }}
                  </h2>
                  <span
                    :class="`block px-2 py-1 text-sm rounded-lg ${decideTextColor(item.color)}`"
                    :style="`background-color: ${item.color};`"
                  >
                    {{ item.label }}
                  </span>
                </div>
                <!-- TODO: Implement -->
                <a href="#" class="text-blue-500 hover:underline">Edit</a>
              </div>
              <div class="text-gray-600">
                <p class="block mb-1">
                  {{ item.description }}
                </p>
                <div class="flex justify-between w-full">
                  <small class="text-gray-600">
                    Created at {{ formatDate(item.created_at) }}
                  </small>
                  <small class="text-gray-600">
                    Updated at {{ formatDate(item.updated_at) }}
                  </small>
                  <small class="text-gray-600" v-if="item.completed_at !== null">
                    Completed at {{ formatDate(item.completed_at) }}
                  </small>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div class="w-64" v-if="owner">
          <h2>{{ list.name }}</h2>
          <small class="text-gray-600" v-if="owner"
            >{{ owner.username }} - {{ formatDate(list.created_at) }}</small
          >
          <h3 class="block mt-4 text-sm text-gray-600">Description</h3>
          <p>
            {{ list.description }}
          </p>
          <h3 class="block mt-4 text-sm text-gray-600">People who have access</h3>
          <ul>
            <li
              class="pb-2 border-b border-gray-400"
              v-for="accessor in list.users_with_access"
              :key="accessor.id"
            >
              <span>
                {{ accessor.user.username }}
                <small v-if="accessor.user_id === owner.id"> - Owner</small>
              </span>
              <small class="block text-gray-600">
                Since {{ formatDate(accessor.created_at) }}</small
              >
            </li>
          </ul>
          <h3 class="block mt-4 text-sm text-gray-600">Gebeurtenissen</h3>
          <ul>
            <Event v-for="event in list.events" :key="event.id" :event="event" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { models } from '@feathersjs/vuex';

import { mustBeLoggedIn, formatDate } from '@/helpers';
import { useRouter } from '@/router';

import Navigation from '@/components/Navigation.vue';
import Event from '@/components/Event.vue';

export default {
  name: 'list',
  components: {
    Navigation,
    Event,
  },
  setup() {
    onMounted(mustBeLoggedIn);

    const router = useRouter();
    const listId = parseInt(router.currentRoute.value.params.id, 10);

    const list = ref(null);
    const owner = ref(null);
    onMounted(async () => {
      const { List } = models.api;
      list.value = await List.get(listId).catch(() => {
        router.push('/');
      });

      // Pluck the owner out of the list
      owner.value = list.value.users_with_access.filter(
        (userWithAccess) => userWithAccess.user_id === list.value.owner_id,
      )[0].user;
    });

    // Based on https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    function decideTextColor(backgroundColor) {
      const noHash = backgroundColor.substring(1);
      let red;
      let green;
      let blue;
      if (noHash.length > 2) {
        red = parseInt(noHash.substring(0, 2), 16);
        green = parseInt(noHash.substring(2, 4), 16);
        blue = parseInt(noHash.substring(4, 6), 16);
      } else {
        red = parseInt(noHash.substring(0, 1), 16);
        green = parseInt(noHash.substring(1, 2), 16);
        blue = parseInt(noHash.substring(2, 3), 16);
      }
      return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? 'text-black' : 'text-white';
    }

    const showCompleted = ref(true);
    const sorteditems = computed(() => {
      let items = [...list.value.items];

      // Filter out completed if checked
      if (!showCompleted.value) {
        items = items.filter((item) => item.completed_at === null);
      }

      // Order according to the order in the database
      return items.sort((a, b) => a.order - b.order);
    });

    return {
      listId,
      list,
      owner,
      formatDate,
      sorteditems,
      decideTextColor,
      showCompleted,
    };
  },
};
</script>
