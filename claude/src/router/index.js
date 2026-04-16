// ============================================================
// router/index.js
// LEARNING #4: Vue Router Setup
//
// Concepts demonstrated:
//  - createRouter + createWebHistory
//  - Dynamic route params (/food/:id)
//  - Navigation Guards (beforeEach) to protect routes
//  - Route meta fields for guard logic
// ============================================================

import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loaded views (better performance — only loads when route is visited)
const HomeView = () => import('../views/HomeView.vue')
const ProductDetailView = () => import('../views/ProductDetailView.vue')
const FavoritesView = () => import('../views/FavoritesView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Menu — Cravings' }  // meta fields for page title etc.
  },
  {
    // LEARNING #4: Dynamic Route — :id is a route param accessible via useRoute()
    path: '/food/:id',
    name: 'ProductDetail',
    component: ProductDetailView,
    meta: { title: 'Food Details — Cravings' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: FavoritesView,
    // requiresAuth: true would trigger the guard below (simulated)
    meta: { title: 'My Favorites — Cravings', requiresItems: false }
  }
]

const router = createRouter({
  history: createWebHistory(), // uses browser History API (no # in URL)
  routes,
  // Scroll to top on every route change
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// ---- NAVIGATION GUARD ----
// LEARNING #4: beforeEach runs before every route navigation.
// You can cancel navigation, redirect, or allow it through.
router.beforeEach((to, from, next) => {
  // Update browser tab title from route meta
  document.title = to.meta.title || 'Cravings'

  // Example guard: if a route required auth, redirect to home
  // (Extendable — swap isAuthenticated with a real auth store check)
  if (to.meta.requiresAuth) {
    const isAuthenticated = false // simulate: replace with useAuthStore().isLoggedIn
    if (!isAuthenticated) {
      return next({ name: 'Home' }) // redirect instead of cancelling
    }
  }

  next() // proceed to route
})

export default router
