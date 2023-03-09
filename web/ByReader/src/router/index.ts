import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '../views/TabsPage.vue'

import { state } from '@/util/store'
import { fetch } from '@/util/fetch'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'LoginPage',
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

function checkLogin(to, next) {
  if (to.name !== 'LoginPage' && state.isLogin === false) {
    next({
      path: '/login',
      replace: true
    })
  } else {
    next()
  }
}

router.beforeResolve((to, from, next) => {
  console.log(to, from, state.isLogin)
  if (state.isLogin === null) {
    fetch('/user/bookshelf').then((data) => {
      if (data.code === 200) {
        state.isLogin = true
      } else {
        state.isLogin = false
      }

      checkLogin(to, next)
    })
  } else {
    checkLogin(to, next)
  }
})

export default router
