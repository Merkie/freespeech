import Vue from 'vue'
import Router from 'vue-router'
import TilePad from './views/TilePad.vue'
import About from './views/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: TilePad
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
