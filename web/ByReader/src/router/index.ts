import { createRouter, createWebHistory, createWebHashHistory } from '@ionic/vue-router'
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
    redirect: '/library'
  },
  {
    path: '/library',
    component: () => import('@/views/LibraryPage.vue'),
  },
  {
    name: 'ComicPage',
    path: '/comic/:comicId',
    component: () => import('@/views/ComicPage.vue')
  },
  {
    name: 'SearchPage',
    path: '/search',
    component: () => import('@/views/SearchPage.vue')
  },
  {
    name: 'ReaderPage',
    path: '/reader',
    component: () => import('@/views/ReaderPage.vue'),
  },
  {
    path: '/site',
    component: () => import('@/views/SitePage.vue')
  },
  {
    name: 'SettingPage',
    path: '/setting',
    component: () => import('@/views/SettingPage.vue')
  },
]

const router = createRouter({
  // mode: 'abstract', // 'abstract' | 'hash' | 'history
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
})

function checkLogin(to, next) {
  if (to.name !== 'LoginPage' && state.isLogin === false) {
    next({
      path: '/login',
      replace: true
    })
  } else if (to.name === 'LoginPage' && state.isLogin === true) {
    next({
      path: '/',
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
