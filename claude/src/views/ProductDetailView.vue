<!-- ============================================================
  ProductDetailView.vue
  LEARNING #4: Dynamic Route with Route Params

  Concepts demonstrated:
   - useRoute() to access route params (/food/:id → route.params.id)
   - useRouter() to programmatically navigate (back button)
   - watch() on route params to refetch when :id changes
   - Integration with Pinia store (favorites toggle)
   - Integration with useApi() composable to get food data
============================================================ -->

<template>
  <div class="detail-page">

    <!-- Back Navigation -->
    <div class="detail-nav">
      <div class="nav-inner">
        <button class="btn-back" @click="router.back()">
          ← Back to Menu
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-screen">
      <span class="loading-emoji">🍽️</span>
      <p>Loading dish details...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!food" class="not-found">
      <span>😕</span>
      <h2>Dish not found</h2>
      <RouterLink to="/" class="btn-home">← Back to Menu</RouterLink>
    </div>

    <!-- Food Detail Content -->
    <div v-else class="detail-content">

      <!-- Hero Image Section -->
      <div class="detail-hero">
        <div class="detail-img-wrap">
          <span class="detail-emoji">{{ food.image }}</span>
          <span v-if="food.isNew" class="detail-badge">New Arrival</span>
        </div>
        <div class="detail-info">

          <div class="detail-meta">
            <span class="detail-category">{{ food.category }}</span>
            <span class="detail-rating">★ {{ food.rating }}</span>
          </div>

          <h1 class="detail-title">{{ food.name }}</h1>
          <p class="detail-desc">{{ food.description }}</p>

          <!-- Tags -->
          <div class="detail-tags" v-if="food.tags.length">
            <span v-for="tag in food.tags" :key="tag" class="tag">
              {{ tagLabel(tag) }}
            </span>
          </div>

          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-icon">⏱</span>
              <span class="stat-value">{{ food.prepTime }}</span>
              <span class="stat-label">Prep Time</span>
            </div>
            <div class="stat">
              <span class="stat-icon">🔥</span>
              <span class="stat-value">{{ food.calories }}</span>
              <span class="stat-label">Calories</span>
            </div>
            <div class="stat">
              <span class="stat-icon">⭐</span>
              <span class="stat-value">{{ food.rating }}</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>

          <!-- Price + Actions -->
          <div class="detail-actions">
            <span class="detail-price">Rs. {{ food.price.toLocaleString() }}</span>

            <!-- LEARNING #3: Pinia store used here -->
            <button
              class="btn-fav"
              :class="{ active: favStore.isFavorite(food.id) }"
              @click="favStore.toggleFavorite(food)"
            >
              {{ favStore.isFavorite(food.id) ? '♥ Saved' : '♡ Save to Favorites' }}
            </button>

            <button class="btn-order-main" @click="showModal = true">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Modal (reusing AppModal with slots) -->
    <AppModal v-model="showModal" title="Place Order" width="400px">
      <template #header>
        <h2 class="modal-title-custom">🎉 Order {{ food?.name }}</h2>
      </template>

      <div class="modal-order-body">
        <p>Your order will be prepared fresh in <strong>{{ food?.prepTime }}</strong> and delivered to you.</p>
        <div class="modal-price-tag">Rs. {{ food?.price?.toLocaleString() }}</div>
      </div>

      <template #footer>
        <button class="btn-cancel" @click="showModal = false">Cancel</button>
        <button class="btn-confirm-detail" @click="confirmOrder">Confirm 🚀</button>
      </template>
    </AppModal>

    <Transition name="toast-slide">
      <div v-if="showToast" class="toast">✅ Order placed!</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router' // LEARNING #4
import { useFavoritesStore } from '../stores/favoritesStore.js' // LEARNING #3
import { useApi } from '../composables/useApi.js'              // LEARNING #2
import AppModal from '../components/AppModal.vue'              // LEARNING #2

// ---- LEARNING #4: Access route params and router ----
const route = useRoute()    // gives access to route.params.id
const router = useRouter()  // gives access to router.back(), router.push(), etc.

const favStore = useFavoritesStore()
const { isLoading, fetchFoods, getFoodById } = useApi()

const food = ref(null)
const showModal = ref(false)
const showToast = ref(false)

// Load food by id from route params
const loadFood = async () => {
  await fetchFoods() // ensure data is loaded
  // LEARNING #4: route.params.id comes from /food/:id in router
  food.value = getFoodById(route.params.id)
}

onMounted(loadFood)

// LEARNING #4 + #2: watch route param changes
// If user navigates from /food/1 to /food/2, reload the data
watch(() => route.params.id, () => {
  loadFood()
})

const tagLabel = (tag) => {
  const labels = { bestseller: '⭐ Bestseller', spicy: '🌶 Spicy', vegetarian: '🌿 Veg', popular: '🔥 Popular', healthy: '💚 Healthy' }
  return labels[tag] || tag
}

const confirmOrder = () => {
  showModal.value = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.detail-page { min-height: 100vh; }

.detail-nav { border-bottom: 1px solid var(--border); padding: 0 24px; }
.detail-nav .nav-inner { max-width: 1200px; margin: 0 auto; height: 56px; display: flex; align-items: center; }
.btn-back { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
.btn-back:hover { color: var(--accent); }

.loading-screen, .not-found {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 60vh; gap: 16px; color: var(--text-muted);
}
.loading-emoji { font-size: 60px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.not-found span { font-size: 56px; }
.not-found h2 { font-family: 'Playfair Display', serif; color: var(--text-primary); }
.btn-home { color: var(--accent); text-decoration: none; font-weight: 600; }

/* Detail Content */
.detail-content { max-width: 1200px; margin: 0 auto; padding: 48px 24px 80px; }
.detail-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
@media (max-width: 768px) { .detail-hero { grid-template-columns: 1fr; } }

.detail-img-wrap {
  background: var(--card-img-bg);
  border-radius: 28px;
  height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid var(--border);
}
.detail-emoji { font-size: 130px; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3)); }
.detail-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--accent);
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.detail-info { display: flex; flex-direction: column; gap: 16px; }
.detail-meta { display: flex; align-items: center; gap: 12px; }
.detail-category { font-size: 12px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
.detail-rating { font-size: 14px; color: #f59e0b; font-weight: 700; }

.detail-title { font-family: 'Playfair Display', serif; font-size: 36px; line-height: 1.2; color: var(--text-primary); }
.detail-desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; }

.detail-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { padding: 5px 14px; border-radius: 20px; background: var(--card-bg); border: 1px solid var(--border); font-size: 12px; color: var(--text-muted); font-weight: 600; }

.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.stat { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 16px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.stat-icon { font-size: 20px; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-primary); font-weight: 700; }
.stat-label { font-size: 11px; color: var(--text-muted); font-weight: 600; }

.detail-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.detail-price { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--text-primary); font-weight: 900; }

.btn-fav {
  padding: 12px 20px; border-radius: 20px; border: 1.5px solid var(--border);
  background: transparent; color: var(--text-muted); font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
}
.btn-fav:hover, .btn-fav.active { border-color: #ef4444; color: #ef4444; background: #1f0e0e; }

.btn-order-main {
  padding: 12px 28px; background: var(--accent); color: #fff; border: none;
  border-radius: 20px; font-size: 15px; font-weight: 700; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: all 0.2s;
}
.btn-order-main:hover { opacity: 0.9; transform: scale(1.03); }

/* Modal */
.modal-title-custom { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text-primary); }
.modal-order-body { text-align: center; padding: 16px 0; }
.modal-order-body p { color: var(--text-muted); font-size: 15px; line-height: 1.6; }
.modal-price-tag { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--accent); font-weight: 900; margin-top: 16px; }
.btn-cancel { padding: 10px 20px; background: transparent; border: 1.5px solid var(--border); color: var(--text-muted); border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-confirm-detail { padding: 10px 24px; background: var(--accent); border: none; color: #fff; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }

.toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #166534; color: #dcfce7; padding: 14px 28px; border-radius: 50px; font-size: 14px; font-weight: 600; z-index: 2000; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
