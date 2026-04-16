<!-- ============================================================
  ProductList.vue
  LEARNING #1: Reusable list component

  Concepts demonstrated:
   - Props for receiving food array and loading state
   - v-for with :key for efficient list rendering
   - Conditional rendering with v-if / v-else
   - Forwarding events from child (ProductCard) to parent
   - Skeleton loading state for better UX
============================================================ -->

<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="food-grid">
      <div v-for="n in skeletonCount" :key="n" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </div>

    <!-- Empty State: no results found -->
    <div v-else-if="foods.length === 0" class="empty-state">
      <span class="empty-icon">🍽️</span>
      <h3>No dishes found</h3>
      <p>Try a different search term or category</p>
    </div>

    <!-- LEARNING #1: Render list using ProductCard component -->
    <!-- Each card is one food item; emit bubbled up to parent view -->
    <div v-else class="food-grid">
      <ProductCard
        v-for="food in foods"
        :key="food.id"
        :food="food"
        @order="$emit('order', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

// ---- PROPS ----
// LEARNING #1: Clean, typed props with defaults
defineProps({
  foods: {
    type: Array,
    default: () => []   // default to empty array so component never breaks
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  skeletonCount: {
    type: Number,
    default: 6   // how many skeleton cards to show during loading
  }
})

// Forward 'order' event to parent (HomeView)
defineEmits(['order'])
</script>

<style scoped>
.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* ---- Skeleton Loader ---- */
.skeleton-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.skeleton-img {
  height: 160px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--skeleton-base) 25%, var(--skeleton-shine) 50%, var(--skeleton-base) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  width: 100%;
}
.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 70%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ---- Empty State ---- */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}
.empty-icon { font-size: 56px; display: block; margin-bottom: 16px; }
.empty-state h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p { font-size: 14px; }
</style>
