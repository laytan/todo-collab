<template>
  <div class="list">
    <div class="row">
      <div class="col s9">
        <div v-if="state.list.name">
          <h1>{{ state.list.name }}</h1>
          <p>{{ state.list.description }}</p>
          <p>{{ state.list.author }}</p>
        </div>

        <todo-list v-if="state.list.name"></todo-list>
      </div>
      <div class="col s3">
        <div>
          <ul id="list-accordion" class="collapsible">
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
                <div v-for="email in state.list.access" :key="email">
                  <span>{{ email }}</span>
                  <span v-if="email !== state.list.author" @click="revokeAccess(email)">
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
                  <input type="email" placeholder="Email" v-model="state.giveAccessEmail">
                    <button class="btn waves-effect yellow black-text" type="submit" name="action">
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

              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive } from '@vue/composition-api';
import { useActions } from '@u3u/vue-hooks';
import { services } from '../feathers';
import todoList from '../components/TodoList.vue';

export default {
  components: {
    todoList,
  },
  setup(_, context) {
    const { SET_CURRENT_LIST } = useActions(['SET_CURRENT_LIST']);

    const state = reactive({
      list: {},
      giveAccessEmail: '',
    });

    onMounted(async () => {
      const listId = context.root._route.params.id;
      state.list = await SET_CURRENT_LIST(listId);

      const acc = document.getElementById('list-accordion');
      window.M.Collapsible.init(acc);
    });

    // TODO: As state action, need f5 to see changes now
    async function revokeAccess(email) {
      await services.todolists.patch(state.list._id, {
        revoke: email,
      });
    }

    // TODO: As state action, need f5 to see changes now
    async function giveAccess() {
      await services.todolists.patch(state.list._id, {
        access: state.giveAccessEmail,
      });
    }

    return {
      state,
      revokeAccess,
      giveAccess,
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
