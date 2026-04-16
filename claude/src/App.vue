<!-- ============================================================
  App.vue — Root Component
  - NavBar is always visible
  - RouterView renders the current page based on route
  - Global CSS variables (design tokens) defined here
  - LEARNING #4: RouterView is where Vue Router renders matched pages
============================================================ -->

<template>
  <div class="app">
    <NavBar />
    <!-- LEARNING #4: RouterView renders HomeView, ProductDetailView, or FavoritesView -->
    <RouterView v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { RouterView } from 'vue-router'
</script>

<style>
/* ============================================================
   GLOBAL STYLES & CSS DESIGN TOKENS
   Using CSS variables makes theming and consistency easy
============================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Color palette */
  --bg: #0f0f0f;
  --card-bg: #1a1a1a;
  --card-img-bg: #242424;
  --border: #2a2a2a;
  --accent: #e8602c;           /* warm orange — appetite-inducing */
  --accent-light: rgba(232, 96, 44, 0.1);
  --text-primary: #f5f0e8;     /* warm white */
  --text-muted: #888;

  /* Skeleton shimmer */
  --skeleton-base: #1e1e1e;
  --skeleton-shine: #2a2a2a;

  /* Typography */
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  color: var(--text-primary);
  background-color: var(--bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body { background: var(--bg); min-height: 100vh; }

/* Page transition */
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
</style>
