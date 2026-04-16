<!-- ============================================================
  NavBar.vue
  - RouterLink for navigation (LEARNING #4)
  - Pinia store for favorites badge count (LEARNING #3)
  - Reactive badge that auto-updates when favorites change
============================================================ -->

<template>
  <header class="navbar">
    <div class="nav-inner">

      <!-- Logo -->
      <RouterLink to="/" class="nav-logo">
        <span class="logo-icon">🍽️</span>
        <span class="logo-text">Cravings</span>
      </RouterLink>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" active-class="nav-link--active" exact>
          Menu
        </RouterLink>

        <!-- Favorites link with live badge count from Pinia store -->
        <RouterLink to="/favorites" class="nav-link nav-link--favs" active-class="nav-link--active">
          Favorites
          <!-- Badge: only shows when there are favorites -->
          <span v-if="favStore.totalCount > 0" class="fav-badge">
            {{ favStore.totalCount }}
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '../stores/favoritesStore.js'

// LEARNING #3: Access Pinia store — totalCount auto-updates reactively
const favStore = useFavoritesStore()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon { font-size: 26px; }
.logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: var(--text-primary);
  font-weight: 700;
}

.nav-links { display: flex; align-items: center; gap: 8px; }

.nav-link {
  padding: 8px 18px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-link:hover, .nav-link--active {
  color: var(--accent);
  background: var(--accent-light);
}

/* Live counter badge */
.fav-badge {
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
</style>
