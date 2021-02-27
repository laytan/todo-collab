import { createApp } from 'vue';
import './style/index.pcss';
import App from '@/App.vue';
import { router } from '@/router';
import { setupFeathers } from '@/feathers';
import { setupStore } from '@/store';

const app = createApp(App);
const feathers = setupFeathers();
const store = setupStore({ feathers });

app
  .use(router)
  .use(store)
  .mount('#app');
