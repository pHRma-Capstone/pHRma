import useAuthStore from '@/store/authStore';
import { Role } from '@/util/types';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      children: [
        {
          path: '/supervisor',
          name: 'supervisor',
          component: () => import('@/views/SupervisorView.vue')
        },
        {
          path: '/employee',
          name: 'employee',
          component: () => import('@/views/EmployeeView.vue')
        },
        {
          path: '/upload',
          name: 'upload',
          component: () => import('@/views/UploadView.vue')
        },
        {
          path: '/logEmployee',
          name: 'logEmployee',
          component: () => import('@/views/ExceptionLogEmployeeView.vue')
        },
        {
          path: '/logSupervisor',
          name: 'logSupervisor',
          component: () => import('@/views/ExceptionLogSupervisorView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    }
    
  ]
});

// this assumes that all routes require authentication except for 'login'
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();

  // let them through to login no matter what
  if (to.name === 'login') {
    next();
    return;
  }

  // if the user is not authenticated, go to 'login'
  if (!authStore.isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  // otherwise, if they are going to 'home', we need to send them to either 'supervisor' or 'employee' based on their role
  // if they are going to 'supervisor' and are an employee, unauth and go to 'login'
  // vice-versa for 'employee'. will most likely want to replcae that logic with a 403 error page
  if (to.name === 'home') {
    next({ name: authStore.getRole() === Role.SUPERVISOR ? 'supervisor' : 'employee' });
    return;
  } else if (to.name === 'supervisor' && authStore.getRole() !== Role.SUPERVISOR) {
    authStore.unauthenticate();
    router.push({ name: 'login' });
  } else if (to.name === 'employee' && authStore.getRole() !== Role.EMPLOYEE) {
    authStore.unauthenticate();
    router.push({ name: 'login' });
  }
  // move along to the next route ('supervisor' or 'employee'), we know they are authenticated
  next();
});
export default router;
