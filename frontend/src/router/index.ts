import { useAuthStore } from '@/store';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        authRequired: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        noAppNav: true
      }
    },
    {
      path: '/dashbard',
      name: 'statistics',
      component: () => import('@/views/StatisticsView.vue'),
      meta: {
        authRequired: true
      }
    }
  ]
});

router.beforeEach((to) => {
  // check if a user is authenticated before routing to a page that has `authRequired: true`
  if (to.meta.authRequired && !useAuthStore().isAuthenticated && to.name !== 'login') {
    return { name: 'login' };
  }
});
export default router;
