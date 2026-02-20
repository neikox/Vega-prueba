import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/audits',
    },
    {
      path: '/audits',
      name: 'AuditList',
      component: () => import('../views/AuditList.vue'),
    },
    {
      path: '/audits/new',
      name: 'AuditWizard',
      component: () => import('../views/AuditWizard.vue'),
    },
    {
      path: '/audits/:id',
      name: 'AuditDetail',
      component: () => import('../views/AuditDetail.vue'),
    },
  ],
})

export default router
