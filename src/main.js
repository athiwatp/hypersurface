const runtime = require('offline-plugin/runtime')

import Vue from 'vue'
import App from './App'
import Welcome from './components/Welcome'
import Feed from './components/Feed'
import Poll from './components/Poll'
import Clip from './components/Clip'
import Category from './components/Category'
import Info from './components/Info'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

runtime.install({
  onUpdateReady: () => {
    runtime.applyUpdate()
  },
  onUpdated: () => {
    window.location.reload()
  }
})

Vue.use(VueRouter)
Vue.use(VueResource)

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next('/feed')
        } else {
          next('/welcome')
        }
      }
    },
    { path: '/welcome', component: Welcome },
    {
      path: '/feed',
      component: Feed,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next()
        } else {
          next('/welcome')
        }
      }
    },
    {
      path: '/clip',
      component: Clip,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next()
        } else {
          next('/welcome')
        }
      }
    },
    {
      path: '/category',
      component: Category,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next()
        } else {
          next('/welcome')
        }
      }
    },
    {
      path: '/info',
      component: Info,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next()
        } else {
          next('/welcome')
        }
      }
    },
    {
      path: '/:question',
      name: 'question',
      component: Poll,
      beforeEnter: (to, from, next) => {
        if (window.localStorage.getItem('user')) {
          next()
        } else {
          next('/welcome')
        }
      }
    },
    { path: '*', redirect: '/' }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
