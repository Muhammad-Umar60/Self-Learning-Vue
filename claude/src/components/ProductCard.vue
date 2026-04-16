<!-- ============================================================
  ProductCard.vue
  LEARNING #1: Reusable Component with Clean Props Design

  Concepts demonstrated:
   - defineProps() with types and defaults
   - defineEmits() for child → parent communication
   - Computed class bindings
   - Integration with Pinia store (global state)
   - RouterLink for navigation
============================================================ -->

<template>
  <div class="product-card" :class="{ 'card--new': food.isNew }">

    <!-- Food Image / Emoji Display -->
    <RouterLink :to="`/food/${food.id}`" class="card-image-link">
      <div class="card-image">
        <span class="food-emoji">{{ food.image }}</span>
        <!-- New badge if isNew prop is true -->
        <span v-if="food.isNew" class="badge badge--new">New</span>
        <!-- Tags like "bestseller", "spicy" -->
        <span v-if="food.tags.includes('bestseller')" class="badge badge--best">⭐ Best</span>
      </div>
    </RouterLink>

    <!-- Card Body -->
    <div class="card-body">
      <div class="card-meta">
        <span class="card-category">{{ food.category }}</span>
        <span class="card-rating">★ {{ food.rating }}</span>
      </div>

      <RouterLink :to="`/food/${food.id}`" class="card-name-link">
        <h3 class="card-name">{{ food.name }}</h3>
      </RouterLink>

      <p class="card-desc">{{ food.description.substring(0, 75) }}...</p>

      <div class="card-info">
        <span class="card-time">⏱ {{ food.prepTime }}</span>
        <span class="card-calories">🔥 {{ food.calories }} cal</span>
      </div>

      <!-- Price + Actions -->
      <div class="card-footer">
        <span class="card-price">Rs. {{ food.price.toLocaleString() }}</span>
        <div class="card-actions">
          <!-- Favorite toggle button — uses Pinia store -->
          <button
            class="btn-favorite"
            :class="{ 'is-favorite': favStore.isFavorite(food.id) }"
            @click="toggleFav"
            :title="favStore.isFavorite(food.id) ? 'Remove from Favorites' : 'Add to Favorites'"
          >
            {{ favStore.isFavorite(food.id) ? '♥' : '♡' }}
          </button>

          <!-- Order button emits event to parent -->
          <button class="btn-order" @click="$emit('order', food)">
            Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '../stores/favoritesStore.js'

// ---- PROPS ----
// LEARNING #1: defineProps with type validation
// Each prop has a type and some have defaults
const props = defineProps({
  food: {
    type: Object,
    required: true   // this card MUST receive a food object
  }
})

// ---- EMITS ----
// LEARNING #1: Define what events this component can emit
// Parent listens with @order="handleOrder"
const emit = defineEmits(['order'])

// ---- PINIA STORE ----
// LEARNING #3: Access global favorites store
const favStore = useFavoritesStore()

// Toggle favorite using the store action
const toggleFav = () => {
  favStore.toggleFavorite(props.food)
}
</script>

<style scoped>
.product-card {
  background: var(--card-bg);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.card-image-link { text-decoration: none; display: block; }

.card-image {
  background: var(--card-img-bg);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.food-emoji { font-size: 72px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }

.badge {
  position: absolute;
  top: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
}
.badge--new { left: 12px; background: var(--accent); color: #fff; }
.badge--best { right: 12px; background: #f59e0b; color: #fff; }

.card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }

.card-meta { display: flex; justify-content: space-between; align-items: center; }
.card-category { font-size: 11px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
.card-rating { font-size: 12px; color: #f59e0b; font-weight: 600; }

.card-name-link { text-decoration: none; }
.card-name { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--text-primary); margin: 0; line-height: 1.3; }
.card-name:hover { color: var(--accent); }

.card-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; margin: 0; }

.card-info { display: flex; gap: 12px; }
.card-time, .card-calories { font-size: 11px; color: var(--text-muted); font-weight: 500; }

.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.card-price { font-size: 18px; font-weight: 700; color: var(--text-primary); font-family: 'Playfair Display', serif; }

.card-actions { display: flex; gap: 8px; align-items: center; }

.btn-favorite {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-favorite:hover, .btn-favorite.is-favorite {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.btn-order {
  padding: 8px 18px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-order:hover { opacity: 0.9; transform: scale(1.04); }
</style>
