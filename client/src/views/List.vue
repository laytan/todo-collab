<template>
  <div class="list">
    <div v-if="state.list.name">
      <h1>{{ state.list.name }}</h1>
      <p>{{ state.list.description }}</p>
      <p>{{ state.list.author }}</p>
      <form @submit.prevent="giveAccess">
        <input type="email" placeholder="Email" v-model="state.giveAccessEmail">
        <input type="submit" value="Give access">
      </form>
      <p>Accounts with access:</p>
      <div v-for="email in state.list.access" :key="email">
        {{ email }} <span v-if="email !== state.list.author" @click="revokeAccess(email)">Revoke access</span>
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
      // await services.userTodoAccess.create({  });
      const listId = context.root._route.params.id;
      console.log(listId);
      const res = await services.todolists.get(listId);
      console.log(res);
      state.list = res;
    });

    async function revokeAccess(email) {
      const res = await services.todolists.patch(state.list._id, {
        revoke: email,
      });
      console.log(res);
    }

    async function giveAccess() {
      const res = await services.todolists.patch(state.list._id, {
        access: state.giveAccessEmail,
      });
      console.log(res);
    }

    return {
      state,
      revokeAccess,
      giveAccess,
    };
  },
};
</script>
