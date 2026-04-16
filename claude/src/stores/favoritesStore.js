// ============================================================
// stores/favoritesStore.js
// LEARNING #3: Pinia — Centralized Global State
//
// Concepts demonstrated:
//  - defineStore (Pinia's way to create a store)
//  - state() — reactive data shared across ALL components
//  - getters — computed values derived from state
//  - actions — methods that mutate state
//  - localStorage persistence (bonus: state survives refresh)
//
// WHY Pinia instead of local state?
//  The favorites list must be accessible from:
//    NavBar (badge count), HomeView (heart icon), FavoritesView (full list)
//  Passing this via props would be deeply nested (prop drilling).
//  Pinia solves this by making state globally available.
// ============================================================

import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  // ---- STATE ----
  // state is like data() in Options API
  // It's the single source of truth for favorites
  state: () => ({
    items: loadFromStorage(), // load persisted favorites on startup
  }),

  // ---- GETTERS ----
  // Getters are like computed properties — they derive values from state
  getters: {
    // Total count for the NavBar badge
    totalCount: (state) => state.items.length,

    // Check if a specific food item is already in favorites
    isFavorite: (state) => (foodId) => {
      return state.items.some(item => item.id === foodId)
    }
  },

  // ---- ACTIONS ----
  // Actions can be sync or async — they modify state
  actions: {
    // Toggle: if already favorite → remove, else → add
    toggleFavorite(food) {
      const index = this.items.findIndex(item => item.id === food.id)

      if (index !== -1) {
        // Already in favorites — remove it
        this.items.splice(index, 1)
      } else {
        // Not in favorites — add it
        this.items.push(food)
      }

      // Persist to localStorage after every change
      saveToStorage(this.items)
    },

    // Remove a specific item by id
    removeItem(foodId) {
      this.items = this.items.filter(item => item.id !== foodId)
      saveToStorage(this.items)
    },

    // Clear all favorites
    clearAll() {
      this.items = []
      saveToStorage(this.items)
    }
  }
})

// ---- localStorage helpers ----
function loadFromStorage() {
  try {
    const data = localStorage.getItem('cravings-favorites')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage(items) {
  localStorage.setItem('cravings-favorites', JSON.stringify(items))
}
