<template>
  <Modal :onClickOutside="close">
    <template v-slot:header>
      Add Item
    </template>
    <form @submit.prevent="submit">
      <Errors :error="error" fallback="Failed to create todo item, please try again later" />
      <div>
        <label for="name">Name<sup>*</sup></label>
        <input v-model="input.name" type="text" name="name" id="name" />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea v-model="input.description" name="description" id="description" rows="2" />
      </div>
      <div>
        <label for="label">Label</label>
        <input v-model="input.label" type="text" name="label" id="label" />
      </div>
      <div>
        <label for="color">Color</label>
        <input v-model="input.color" class="w-full h-8" type="color" name="color" id="color" />
      </div>
    </form>
    <template v-slot:footer>
      <Button type="submit" @click="submit">Add</Button>
      <Button @click="close">Cancel</Button>
    </template>
  </Modal>
</template>

<script>
import { reactive, computed, ref } from 'vue';
import { models } from '@feathersjs/vuex';

import Button from '@/components/Button.vue';
import Errors from '@/components/Errors.vue';
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
    Button,
    Errors,
  },
  props: {
    listId: {
      type: Number,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { Todo } = models.api;

    const input = reactive({
      name: '',
      description: '',
      label: '',
      color: '',
    });

    const payload = computed(() => ({
      ...input,
      order: 0,
      list_id: props.listId,
    }));

    const error = ref({});
    function submit() {
      error.value = {};

      new Todo(payload.value)
        .save()
        .then(() => {
          props.close();
        })
        .catch((e) => {
          error.value = e;
        });
    }

    return { submit, input, error };
  },
};
</script>
