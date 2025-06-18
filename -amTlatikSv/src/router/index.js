import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'geolocalizacion',
      component: () => import('../views/GeolocalizacionView.vue')
    },
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/calendarizacion',
      name: 'calendarizacion',
      component: () => import('../views/CalendarizacionView.vue')
    },
    {
      path: '/recetas',
      name: 'recetas',
      component: () => import('../views/RecetasView.vue')
    },
    {
      path: '/historia',
      name: 'historia',
      component: () => import('../views/HistoriaView.vue')
    },
    {
      path: '/comunidad',
      name: 'comunidad',
      component: () => import('../views/ComunidadView.vue')
    }
  ],
})

export default router
