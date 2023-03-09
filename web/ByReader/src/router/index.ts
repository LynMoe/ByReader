import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/library'
      },
      {
        path: 'library',
        component: () => import('@/views/LibraryPage.vue')
      },
      {
        name: 'ComicPage',
        path: 'library/comic/:comicId',
        component: () => import('@/views/ComicPage.vue')
      },
      {
        path: 'library/search',
        component: () => import('@/views/SearchPage.vue')
      },
      {
        path: 'site',
        component: () => import('@/views/SitePage.vue')
      },
      {
        path: 'setting',
        component: () => import('@/views/SettingPage.vue')
      },
      {
        path: 'reader',
        component: () => import('@/views/ReaderPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
