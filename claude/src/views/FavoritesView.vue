<!-- ============================================================
  FavoritesView.vue
  LEARNING #3: Consuming Pinia Global State

  Concepts demonstrated:
   - useFavoritesStore() to read and modify global state
   - store.items — reactive, auto-updates UI on change
   - store.totalCount — getter computed from state
   - store.removeItem() — action to mutate state
   - store.clearAll() — action with confirmation
   - RouterLink to navigate to product detail (LEARNING #4)
============================================================ -->

<template>
  <div class="favorites-page">
    <div class="fav-inner">

      <!-- Page Header -->
      <div class="fav-header">
        <div>
          <p class="fav-subtitle">Your Saved Dishes</p>
          <h1 class="fav-title">Favorites</h1>
        </div>
        <!-- Clear all button — only if there are items -->
        <button
          v-if="favStore.totalCount > 0"
          class="btn-clear"
          @click="confirmClear"
        >
          Clear All
        </button>
      </div>

      <!-- ---- EMPTY STATE ---- -->
      <div v-if="favStore.totalCount === 0" class="empty-favs">
        <span class="empty-icon">🤍</span>
        <h2>No favorites yet</h2>
        <p>Browse the menu and save dishes you love</p>
        <RouterLink to="/" class="btn-browse">Explore Menu →</RouterLink>
      </div>

      <!-- ---- FAVORITES GRID ---- -->
      <!-- favStore.items is the reactive Pinia state — updates globally -->
      <div v-else class="favs-grid">
        <div
          v-for="food in favStore.items"
          :key="food.id"
          class="fav-card"
        >
          <!-- Food Image -->
          <RouterLink :to="`/food/${food.id}`" class="fav-img-link">
            <div class="fav-img">
              <span class="fav-emoji">{{ food.image }}</span>
            </div>
          </RouterLink>

          <!-- Info -->
          <div class="fav-body">
            <div class="fav-meta">
              <span class="fav-cat">{{ food.category }}</span>
              <span class="fav-rating">★ {{ food.rating }}</span>
            </div>
            <RouterLink :to="`/food/${food.id}`" class="fav-name-link">
              <h3 class="fav-name">{{ food.name }}</h3>
            </RouterLink>
            <p class="fav-desc">{{ food.description.substring(0, 80) }}...</p>

            <div class="fav-footer">
              <span class="fav-price">Rs. {{ food.price.toLocaleString() }}</span>
              <div class="fav-actions">
                <!-- LEARNING #3: Call store action to remove from favorites -->
                <button
                  class="btn-remove"
                  @click="favStore.removeItem(food.id)"
                  title="Remove from favorites"
                >
                  ✕
                </button>
                <button class="btn-order-fav" @click="orderFood(food)">
                  Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary bar (if items exist) -->
      <div v-if="favStore.totalCount > 0" class="fav-summary">
        <p>{{ favStore.totalCount }} dish{{ favStore.totalCount !== 1 ? 'es' : '' }} saved</p>
      </div>

    </div>

    <!-- Order Modal -->
    <AppModal v-model="showModal" width="400px">
      <template #header>
        <h2 class="modal-h">Order {{ orderTarget?.name }}</h2>
      </template>
      <div class="modal-simple">
        <span class="modal-big-emoji">{{ orderTarget?.image }}</span>
        <p class="modal-price">Rs. {{ orderTarget?.price?.toLocaleString() }}</p>
        <p class="modal-sub">Ready in {{ orderTarget?.prepTime }}</p>
      </div>
      <template #footer>
        <button class="btn-cancel" @click="showModal = false">Cancel</button>
        <button class="btn-confirm-fav" @click="placeOrder">Order Now 🎉</button>
      </template>
    </AppModal>

    <Transition name="toast-slide">
      <div v-if="showToast" class="toast">✅ Order placed!</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '../stores/favoritesStore.js'  // LEARNING #3
import AppModal from '../components/AppModal.vue'

// LEARNING #3: Access global Pinia store
// Changes here automatically reflect in NavBar badge, HomeView hearts, etc.
const favStore = useFavoritesStore()

const showModal = ref(false)
const orderTarget = ref(null)
const showToast = ref(false)

const orderFood = (food) => {
  orderTarget.value = food
  showModal.value = true
}

const placeOrder = () => {
  showModal.value = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const confirmClear = () => {
  if (confirm('Remove all favorites?')) {
    // LEARNING #3: Store action mutates global state
    favStore.clearAll()
  }
}
</script>

<style scoped>
.favorites-page { min-height: 100vh; }
.fav-inner { max-width: 1200px; margin: 0 auto; padding: 48px 24px 80px; }

.fav-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.fav-subtitle { font-size: 12px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
.fav-title { font-family: 'Playfair Display', serif; font-size: 42px; color: var(--text-primary); }

.btn-clear {
  padding: 10px 20px; background: transparent; border: 1.5px solid #ef444460;
  color: #ef4444; border-radius: 20px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
}
.btn-clear:hover { background: #ef44440f; }

/* Empty State */
.empty-favs { text-align: center; padding: 80px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 64px; }
.empty-favs h2 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--text-primary); }
.empty-favs p { color: var(--text-muted); font-size: 15px; }
.btn-browse { margin-top: 8px; padding: 12px 28px; background: var(--accent); color: #fff; border-radius: 20px; text-decoration: none; font-weight: 700; font-size: 14px; transition: opacity 0.2s; }
.btn-browse:hover { opacity: 0.9; }

/* Favorites Grid */
.favs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }

.fav-card { background: var(--card-bg); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
.fav-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.15); }

.fav-img-link { display: block; }
.fav-img { height: 150px; background: var(--card-img-bg); display: flex; align-items: center; justify-content: center; }
.fav-emoji { font-size: 68px; }

.fav-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.fav-meta { display: flex; justify-content: space-between; }
.fav-cat { font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; }
.fav-rating { font-size: 12px; color: #f59e0b; font-weight: 700; }
.fav-name-link { text-decoration: none; }
.fav-name { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--text-primary); }
.fav-name:hover { color: var(--accent); }
.fav-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

.fav-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.fav-price { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: var(--text-primary); }
.fav-actions { display: flex; gap: 8px; }

.btn-remove { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid var(--border); background: transparent; color: var(--text-muted); font-size: 12px; cursor: pointer; transition: all 0.2s; }
.btn-remove:hover { border-color: #ef4444; color: #ef4444; background: #1f0e0e; }

.btn-order-fav { padding: 8px 18px; background: var(--accent); color: #fff; border: none; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: opacity 0.2s; }
.btn-order-fav:hover { opacity: 0.9; }

.fav-summary { margin-top: 40px; text-align: center; font-size: 13px; color: var(--text-muted); }

/* Modal */
.modal-h { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text-primary); }
.modal-simple { text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.modal-big-emoji { font-size: 64px; }
.modal-price { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--accent); font-weight: 900; }
.modal-sub { font-size: 14px; color: var(--text-muted); }
.btn-cancel { padding: 10px 20px; background: transparent; border: 1.5px solid var(--border); color: var(--text-muted); border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-confirm-fav { padding: 10px 24px; background: var(--accent); border: none; color: #fff; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }

.toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); background: #166534; color: #dcfce7; padding: 14px 28px; border-radius: 50px; font-size: 14px; font-weight: 600; z-index: 2000; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
