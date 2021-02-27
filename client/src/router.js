import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/views/Home.vue';

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/authentication',
      name: 'authentication',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "authentication" */ './views/Authentication.vue'),
    },
    {
      path: '/lists/:id',
      name: 'list',
      component: () => import(/* webpackChunkName: "list" */ './views/List.vue'),
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import(/* webpackChunkName: "verify" */ './views/Verify.vue'),
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import(/* webpackChunkName: "reset" */ './views/Reset.vue'),
    },
    {
      path: '/lists',
      name: 'lists',
      component: () => import(/* webpackChunkName: "lists" */ './views/Lists.vue'),
    },
  ],
});

// router.beforeEach(async (to, from, next) => {
//   const dispatch = useStore();
//   const user = mapState('user');

//   function initState() {
//     dispatch(actions.INIT);
//     dispatch(actions.SYNC_LISTS);
//   }

//   if (!user.value.id) {
//     // Try to log in
//     const loggedIn = await dispatch(actions.TRY_AUTH);
//     if (loggedIn) {
//       initState();
//     }
//   } else {
//     // Already loggedIn
//     initState();
//   }

//   next();
// });

export function useRouter() {
  return router;
}
