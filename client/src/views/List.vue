<template>
  <div>
    <Navigation class="mb-6" />
    <div v-if="list" class="container px-2 mx-auto">
      <AddItemModal
        v-if="showAddItemModal"
        :close="() => (showAddItemModal = false)"
        :listId="list.id"
      />
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-end gap-4">
          <h1 class="text-4xl text-red-400">{{ list.name }}</h1>
          <label class="text-sm">
            <input v-model="showCompleted" class="w-3 h-3" type="checkbox" />
            Show completed
          </label>
        </div>
        <button @click="showAddItemModal = true" class="text-blue-500 hover:underline">
          New Item
        </button>
      </div>
      <div class="flex gap-12 p-4 bg-gray-100 shadow">
        <ul class="flex-grow">
          <li
            class="flex items-center gap-6 py-2 border-b border-gray-400"
            v-for="item in items"
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
                    v-if="item.label.length"
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
          <ul class="flex justify-between mb-2">
            <li @click="() => (tab = 0)" class="w-full p-1 mr-0.5 text-sm bg-gray-300">Details</li>
            <li @click="() => (tab = 1)" class="w-full p-1 mx-0.5 text-sm text-center bg-gray-300">
              accessors
            </li>
            <li @click="() => (tab = 3)" class="w-full p-1 ml-0.5 text-sm text-right bg-gray-300">
              Events
            </li>
          </ul>
          <div v-if="tab === 0">
            <h2>{{ list.name }}</h2>
            <small class="text-gray-600" v-if="owner"
              >{{ owner.username }} - {{ formatDate(list.created_at) }}</small
            >
            <h3 class="block mt-4 text-sm text-gray-600">Description</h3>
            <p>
              {{ list.description }}
            </p>
          </div>
          <div v-if="tab === 1">
            <Accessors :ownerId="list.owner_id" :listId="list.id" />
          </div>
          <div v-if="tab === 3">
            <Events :listId="list.id" :listItems="items" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import { models, useFind, useGet } from '@feathersjs/vuex';

import { mustBeLoggedIn, formatDate } from '@/helpers';
import { useRouter } from '@/router';

import Navigation from '@/components/Navigation.vue';
import Events from '@/components/Events.vue';
import Accessors from '@/components/Accessors.vue';
import AddItemModal from '@/components/modals/AddItemModal.vue';

export default {
  name: 'list',
  components: {
    Navigation,
    AddItemModal,
    Events,
    Accessors,
  },
  setup() {
    onMounted(mustBeLoggedIn);

    const router = useRouter();
    const listId = parseInt(router.currentRoute.value.params.id, 10);

    const { List, Todo, User } = models.api;

    const { item: list } = useGet({
      model: List,
      id: listId,
    });

    const ownerGet = computed(() => {
      if (list.value?.owner_id) {
        return useGet({
          model: User,
          id: list.value.owner_id,
        });
      }
      return { item: {} };
    });

    const showCompleted = ref(true);
    const findTodosParams = computed(() => {
      const params = {
        query: {
          list_id: listId,
          $sort: { created_at: -1 },
        },
      };

      if (!showCompleted.value) {
        params.query.completed_at = null;
      }

      return params;
    });

    const { items } = useFind({
      model: Todo,
      params: findTodosParams,
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

    const showAddItemModal = ref(false);

    const tab = ref(0);

    return {
      tab,
      list,
      owner: ownerGet.value.item,
      formatDate,
      items,
      decideTextColor,
      showCompleted,
      showAddItemModal,
    };
  },
};
</script>
