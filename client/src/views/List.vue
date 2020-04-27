<template>
  <div>
    <div v-if="list" class="list">
      <div class="row">
        <div class="col s9">
          <div v-if="list.name">
            <h1>{{ list.name }}</h1>
            <p>{{ list.description }}</p>
            <p>{{ list.owner_id }}</p>
          </div>

          <todo-list :list="list" v-if="list.name"></todo-list>
        </div>
        <div class="col s3">
          <div>
            <ul ref="listAccordion" id="list-accordion" class="collapsible">
              <li>
                <div class="collapsible-header valign-wrapper waves-effect cyan lighten-4">
                    Users
                  <div class="icon-stack ml-auto">
                    <i class="material-icons">person_outline</i>
                    <i class="material-icons arrow-down">arrow_drop_down</i>
                    <i class="material-icons arrow-up">arrow_drop_up</i>
                  </div>
                </div>
                <div class="collapsible-body cyan lighten-5">
                  <p>Accounts with access:</p>
                  <div v-for="email in list.access" :key="email">
                    <span>{{ email }}</span>
                    <span v-if="email !== list.author" @click="revokeAccess(email)">
                      Revoke access
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div class="collapsible-header valign-wrapper waves-effect cyan lighten-4">
                  Add Collaborators
                  <div class="icon-stack ml-auto">
                    <i class="material-icons">supervisor_account</i>
                    <i class="material-icons arrow-down">arrow_drop_down</i>
                    <i class="material-icons arrow-up">arrow_drop_up</i>
                  </div>
                </div>
                <div class="collapsible-body cyan lighten-5">
                  <p>Enter your collaborators emails here: </p>
                  <form @submit.prevent="giveAccess">
                    <input type="email" placeholder="Email" v-model="giveAccessEmail">
                      <button
                        class="btn waves-effect yellow black-text"
                        type="submit"
                        name="action"
                      >
                        Give access
                        <i class="material-icons right">add</i>
                      </button>
                  </form>
                </div>
              </li>
              <li>
                <div class="collapsible-header valign-wrapper waves-effect cyan lighten-4">
                  Events
                  <div class="icon-stack ml-auto">
                    <i class="material-icons">view_stream</i>
                    <i class="material-icons arrow-down">arrow_drop_down</i>
                    <i class="material-icons arrow-up">arrow_drop_up</i>
                  </div>
                </div>
                <div class="collapsible-body cyan lighten-5">
                  <h4>List</h4>
                  <ul>
                    <li v-for="event in list.events" :key="event.id">
                      {{ event.emitter.username }}
                      {{ event.type.toLowerCase() }}d the list. <br>
                      <small>{{ new Date(event.created_at).toLocaleString() }}</small>
                    </li>
                  </ul>
                  <h4>Items</h4>
                  <ul v-for="item in itemsWithEvents" :key="item.id">
                    <h5>{{ item.name }}</h5>
                    <li v-for="event in item.events" :key="event.id">
                      {{ event.emitter.username }}
                      {{ event.type.toLowerCase() }}d the item. <br>
                      <small>{{ new Date(event.created_at).toLocaleString() }}</small>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watch, ref, computed } from 'vue';

import { mapState } from '@/store';
import { useRouter } from '@/router';

import todoList from '@/components/TodoList.vue';

export default {
  components: {
    todoList,
  },
  setup() {
    const lists = mapState('lists');

    const router = useRouter();
    const listId = parseInt(router.currentRoute.value.params.id, 10);
    const currentList = computed(() => lists.value.filter((list) => list.id === listId)[0]);

    const itemsWithEvents = computed(
      () => currentList.value.items.filter((item) => item.events.length > 0),
    );

    const giveAccessEmail = ref('');

    const listAccordion = ref(null);
    watch(listAccordion, (val) => {
      if (!val) {
        return;
      }
      window.M.Collapsible.init(val);
    });

    // TODO: As state action, need f5 to see changes now
    // eslint-disable-next-line
    async function revokeAccess(email) {
      // await services.todolists.patch(list.id, {
      //   revoke: email,
      // });
    }

    // TODO: As state action, need f5 to see changes now
    async function giveAccess() {
      // await services.todolists.patch(list.id, {
      //   access: state.giveAccessEmail,
      // });
    }

    return {
      giveAccessEmail,
      revokeAccess,
      giveAccess,
      list: currentList,
      itemsWithEvents,
      listAccordion,
    };
  },
};
</script>
<style lang="scss">
.ml-auto {
  margin-left: auto;
}

.icon-stack {
  display: flex;
  flex-direction: column;
}

.collapsible {
  .arrow-up {
    display: none;
  }

  .active {
    .arrow-up {
      display: block;
    }
    .arrow-down {
      display: none;
    }
  }
}
</style>
