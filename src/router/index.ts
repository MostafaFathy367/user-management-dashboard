import { createRouter, createWebHistory } from 'vue-router';
import UserList from '@/views/UserList.vue';
import UserDetail from '@/views/UserDetails.vue';
import { useUserStore } from '@/stores/useStore';

const routes = [
  { path: '/', component: UserList, meta: { requiresAuth: true } },
  { path: '/user/:id', component: UserDetail, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/login', component: { template: '<div>Login Page (TBD)</div>' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const user = userStore.currentUser;

  if (to.meta.requiresAuth && !user) {
    return next('/login');
  }
  if (to.meta.requiresAdmin && user?.role !== 'admin') {
    return next({ path: '/', replace: true });
  }
  next();
});

export default router;