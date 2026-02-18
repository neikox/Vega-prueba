import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/audits'
    },
    {
      path: '/audits',
      name: 'AuditList',
      component: () => import('../views/AuditList.vue')
    }
  ],
})

export default router
