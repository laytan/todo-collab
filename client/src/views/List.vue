<template>
  <div class="list">
    <div class="row">
      <div class="col s9">
        <div v-if="state.list.name">
          <h1>{{ state.list.name }}</h1>
          <p>{{ state.list.description }}</p>
          <p>{{ state.list.author }}</p>
        </div>

        <todo-list></todo-list>
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
import { services } from '../feathers';

export default {
  setup(_, context) {
    const state = reactive({
      list: {},
      giveAccessEmail: '',
    });

    onMounted(async () => {
      // eslint-disable-next-line no-underscore-dangle
      const listId = context.root._route.params.id;
      const res = await services.todolists.get(listId);
      state.list = res;

      const acc = document.getElementById('list-accordion');
      window.M.Collapsible.init(acc);
    });

    async function revokeAccess(email) {
      // eslint-disable-next-line no-underscore-dangle
      await services.todolists.patch(state.list._id, {
        revoke: email,
      });
    }

    async function giveAccess() {
      // eslint-disable-next-line no-underscore-dangle
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
