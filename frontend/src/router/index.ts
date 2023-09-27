import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/pages/login/index.vue'
import { addPermissions } from './middlewares/permission'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'BlankLayout',
    },
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../pages/accounts/index.vue'),
    meta: {
      title: 'Acessos',
    },
  },
  {
    path: '/toll-plazas',
    name: 'TollPlazas',
    component: () =>
      import(
        /* webpackChunkName: "tollplazas" */ '../pages/tollplazas/index.vue'
      ),
    meta: {
      title: 'Valores de Praças',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '../pages/dashboard/index.vue'
      ),
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () =>
      import(/* webpackChunkName: "invoices" */ '../pages/invoices/index.vue'),
    meta: {
      title: 'Faturas',
    },
  },
  {
    path: '/toll-ticket-analyzes',
    name: 'TollTicketAnalyzes',
    component: () =>
      import(/* webpackChunkName: "analyzes" */ '../pages/analyzes/ticket.vue'),
    meta: {
      title: 'Analises Pedágio',
    },
  },
  {
    path: '/toll-valley-analyzes',
    name: 'TollValleyAnalyzes',
    component: () =>
      import(/* webpackChunkName: "analyzes" */ '../pages/analyzes/valley.vue'),
    meta: {
      title: 'Analises Vale-Pedágio',
    },
  },
  {
    path: '/vehicles',
    name: 'Veículos',
    component: () =>
      import(/* webpackChunkName: "vehicles" */ '../pages/vehicles/index.vue'),
    meta: {
      title: 'Veículos',
    },
  },
  {
    path: '/mensalidades',
    name: 'Mensalidades',
    component: () =>
      import(
        /* webpackChunkName: "mensalidades" */ '../pages/mensalidades/index.vue'
      ),
    meta: {
      title: 'Mensalidades',
    },
  },
  {
    path: '/consultas',
    name: 'Consultas',
    component: () =>
      import(
        /* webpackChunkName: "mensalidades" */ '../pages/consultas/index.vue'
      ),
    meta: {
      title: 'Consultas',
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

addPermissions(router)

export default router
