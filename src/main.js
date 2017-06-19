import Vue from 'vue'
import Vonic from 'vonic'

// Page Components
import Guess from './components/guess.vue'
import About from './components/About.vue'
import Place from './components/place.vue'

// Routes
const routes = [
  { path: '/guess', component: Guess },
  { path: '/place', component: Place },
  { path: '/', component: About }
]

Vue.use(Vonic.app, {
  routes: routes
})
