<!-- ============================================================
  HomeView.vue — Main Menu Page
  COMBINES ALL 4 LEARNING OBJECTIVES:

  LEARNING #1: Uses ProductList (which uses ProductCard) and Pagination
  LEARNING #2: useApi() composable provides all data + computed logic
               AppModal uses slots for order confirmation
  LEARNING #3: Favorites state managed via Pinia (inside ProductCard)
  LEARNING #4: RouterLink to /food/:id via ProductCard
============================================================ -->

<template>
  <main class="home">

    <!-- ---- HERO SECTION ---- -->
    <section class="hero">
      <div class="hero-content">
        <p class="hero-tag">🌟 Fresh & Hot, Delivered Fast</p>
        <h1 class="hero-title">
          What are you<br />
          <em>craving</em> today?
        </h1>
        <!-- Search input bound to searchQuery from useApi() composable -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search burgers, sushi, pasta..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
        </div>
      </div>
      <div class="hero-visual">🍽️</div>
    </section>

    <div class="content-wrapper">

      <!-- ---- CATEGORY FILTERS ---- -->
      <!-- categories is a computed value from useApi() composable -->
      <div class="categories">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- ---- RESULTS INFO ---- -->
      <div class="results-info" v-if="!isLoading">
        <span>
          {{ filteredFoods.length }} dish{{ filteredFoods.length !== 1 ? 'es' : '' }}
          <span v-if="selectedCategory !== 'All'"> in <strong>{{ selectedCategory }}</strong></span>
          <span v-if="searchQuery"> matching "<strong>{{ searchQuery }}</strong>"</span>
        </span>
      </div>

      <!-- ---- LEARNING #1: ProductList renders the grid ---- -->
      <!-- isLoading & foods flow from useApi() composable -->
      <ProductList
        :foods="paginatedFoods"
        :isLoading="isLoading"
        @order="openOrderModal"
      />

      <!-- ---- LEARNING #1: Pagination component ---- -->
      <!-- v-model updates currentPage via 'update:currentPage' emit -->
      <Pagination
        v-model:currentPage="currentPage"
        :totalPages="totalPages"
      />
    </div>

    <!-- ============================================================
      LEARNING #2: AppModal with NAMED SLOTS
      - #header slot: custom title with food emoji
      - default slot: order details
      - #footer slot: action buttons
    ============================================================ -->
    <AppModal v-model="showOrderModal" title="Confirm Order" width="420px">

      <!-- Named header slot -->
      <template #header>
        <div class="modal-food-header">
          <span class="modal-emoji">{{ selectedFood?.image }}</span>
          <div>
            <p class="modal-pretitle">Order Confirmation</p>
            <h2 class="modal-food-name">{{ selectedFood?.name }}</h2>
          </div>
        </div>
      </template>

      <!-- Default slot (body) -->
      <div v-if="selectedFood" class="order-details">
        <div class="order-row">
          <span>Category</span>
          <strong>{{ selectedFood.category }}</strong>
        </div>
        <div class="order-row">
          <span>Prep Time</span>
          <strong>{{ selectedFood.prepTime }}</strong>
        </div>
        <div class="order-row">
          <span>Calories</span>
          <strong>{{ selectedFood.calories }} kcal</strong>
        </div>
        <div class="order-row order-total">
          <span>Total</span>
          <strong class="total-price">Rs. {{ selectedFood.price.toLocaleString() }}</strong>
        </div>
      </div>

      <!-- Named footer slot -->
      <template #footer>
        <button class="btn-cancel" @click="showOrderModal = false">Cancel</button>
        <button class="btn-confirm" @click="placeOrder">Place Order 🎉</button>
      </template>
    </AppModal>

    <!-- Order Success Toast -->
    <Transition name="toast-slide">
      <div v-if="showToast" class="toast">
        ✅ Order placed successfully!
      </div>
    </Transition>

  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'   // LEARNING #2
import ProductList from '../components/ProductList.vue'  // LEARNING #1
import Pagination from '../components/Pagination.vue'    // LEARNING #1
import AppModal from '../components/AppModal.vue'        // LEARNING #2

// ---- LEARNING #2: Destructure everything from the composable ----
// This is the power of composables — all logic is encapsulated in useApi()
const {
  isLoading,
  searchQuery,
  selectedCategory,
  currentPage,
  filteredFoods,
  paginatedFoods,
  totalPages,
  categories,
  fetchFoods,
} = useApi()

// ---- Local state for this view only ----
const showOrderModal = ref(false)
const selectedFood = ref(null)
const showToast = ref(false)

// ---- Load foods on page mount ----
onMounted(() => {
  fetchFoods()
})

// Open modal with selected food
const openOrderModal = (food) => {
  selectedFood.value = food
  showOrderModal.value = true
}

// Simulate placing an order
const placeOrder = () => {
  showOrderModal.value = false
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}
</script>

<style scoped>
.home { min-height: 100vh; }

/* ---- Hero ---- */
.hero {
  background: linear-gradient(135deg, #1a0e08 0%, #1f1209 50%, #0f0f0f 100%);
  padding: 64px 24px 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;
}
.hero-content { flex: 1; }
.hero-tag { font-size: 13px; font-weight: 600; color: var(--accent); letter-spacing: 1px; margin-bottom: 12px; }
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.15;
  color: var(--text-primary);
  margin-bottom: 28px;
}
.hero-title em { color: var(--accent); font-style: italic; }
.hero-visual { font-size: 120px; filter: drop-shadow(0 10px 30px rgba(232, 96, 44, 0.3)); display: none; }
@media (min-width: 768px) { .hero-visual { display: block; } }

/* Search */
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card-bg);
  border: 1.5px solid var(--border);
  border-radius: 50px;
  padding: 12px 20px;
  max-width: 480px;
  transition: border-color 0.2s;
}
.search-bar:focus-within { border-color: var(--accent); }
.search-icon { font-size: 16px; }
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 15px;
  font-family: 'DM Sans', sans-serif;
}
.search-input::placeholder { color: var(--text-muted); }
.search-clear { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; }

/* Content */
.content-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 24px 80px; }

/* Categories */
.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 32px 0 24px;
}
.cat-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.cat-btn:hover, .cat-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.results-info { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }
.results-info strong { color: var(--text-primary); }

/* Modal Styles */
.modal-food-header { display: flex; align-items: center; gap: 16px; }
.modal-emoji { font-size: 52px; }
.modal-pretitle { font-size: 11px; color: var(--accent); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.modal-food-name { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text-primary); }

.order-details { display: flex; flex-direction: column; gap: 12px; }
.order-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; padding: 10px 0; border-bottom: 1px solid var(--border); color: var(--text-muted); }
.order-row strong { color: var(--text-primary); }
.order-total { border-bottom: none; font-size: 16px; }
.total-price { font-size: 22px; font-family: 'Playfair Display', serif; color: var(--accent); }

.btn-cancel, .btn-confirm {
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.btn-cancel { background: transparent; border: 1.5px solid var(--border); color: var(--text-muted); }
.btn-cancel:hover { border-color: var(--text-muted); color: var(--text-primary); }
.btn-confirm { background: var(--accent); border: none; color: #fff; }
.btn-confirm:hover { opacity: 0.9; transform: scale(1.03); }

/* Toast */
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #166534;
  color: #dcfce7;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  z-index: 2000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
