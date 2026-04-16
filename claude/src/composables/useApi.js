// ============================================================
// composables/useApi.js
// LEARNING #2: Composable using Composition API
//
// Concepts demonstrated:
//  - Composable = a function that uses Vue's reactivity APIs
//  - ref() for reactive state inside composable
//  - computed() to derive values from reactive state
//  - watch() to react to changes in reactive values
//  - Encapsulation: any component can reuse this logic
//
// This composable simulates fetching food data.
// In a real project, replace the mock data with actual fetch() calls.
// ============================================================

import { ref, computed, watch } from 'vue'

// ---- Mock food database ----
// In production, this would be: const res = await fetch('/api/foods')
const MOCK_FOODS = [
  { id: 1, name: 'Truffle Mushroom Burger', category: 'Burgers', price: 1450, rating: 4.9, prepTime: '20 min', calories: 680, image: '🍔', description: 'Wagyu beef patty with black truffle aioli, caramelized onions, aged cheddar, and a brioche bun. A luxury burger experience.', tags: ['bestseller', 'spicy'], isNew: false },
  { id: 2, name: 'Margherita Pizza', category: 'Pizza', price: 1200, rating: 4.7, prepTime: '25 min', calories: 520, image: '🍕', description: 'Stone-baked with San Marzano tomatoes, fresh buffalo mozzarella, and hand-torn basil on a wood-fired dough.', tags: ['vegetarian'], isNew: false },
  { id: 3, name: 'Dragon Roll Sushi', category: 'Sushi', price: 1800, rating: 4.8, prepTime: '15 min', calories: 340, image: '🍣', description: 'Shrimp tempura and cucumber inside, topped with avocado, tobiko, and a spicy sriracha drizzle.', tags: ['spicy', 'popular'], isNew: true },
  { id: 4, name: 'Thai Green Curry', category: 'Asian', price: 980, rating: 4.6, prepTime: '30 min', calories: 490, image: '🍛', description: 'Slow-cooked green curry with coconut milk, Thai basil, kaffir lime leaves, and jasmine rice.', tags: ['spicy', 'vegetarian'], isNew: false },
  { id: 5, name: 'Classic Caesar Salad', category: 'Salads', price: 750, rating: 4.4, prepTime: '10 min', calories: 280, image: '🥗', description: 'Romaine hearts, house-made Caesar dressing, Parmigiano-Reggiano, croutons, and anchovy fillets.', tags: [], isNew: false },
  { id: 6, name: 'Ribeye Steak', category: 'Grills', price: 3200, rating: 4.9, prepTime: '35 min', calories: 820, image: '🥩', description: '300g grain-fed ribeye, charcoal grilled to your preference, served with chimichurri and truffle fries.', tags: ['bestseller'], isNew: false },
  { id: 7, name: 'Avocado Toast Deluxe', category: 'Breakfast', price: 650, rating: 4.3, prepTime: '12 min', calories: 360, image: '🥑', description: 'Sourdough toast with smashed avocado, poached eggs, feta cheese, pomegranate seeds, and micro herbs.', tags: ['vegetarian', 'healthy'], isNew: true },
  { id: 8, name: 'Lobster Pasta', category: 'Pasta', price: 2400, rating: 4.8, prepTime: '28 min', calories: 610, image: '🦞', description: 'Fresh tagliatelle with half lobster, cherry tomatoes, white wine cream sauce, and fresh parsley.', tags: ['popular'], isNew: true },
  { id: 9, name: 'Chicken Tikka Masala', category: 'Asian', price: 850, rating: 4.5, prepTime: '25 min', calories: 540, image: '🍗', description: 'Tender chicken in a rich tomato-cream masala, served with garlic naan and basmati rice.', tags: ['spicy'], isNew: false },
  { id: 10, name: 'Chocolate Lava Cake', category: 'Desserts', price: 550, rating: 4.9, prepTime: '18 min', calories: 420, image: '🍫', description: 'Warm Belgian chocolate cake with a molten center, vanilla bean ice cream, and raspberry coulis.', tags: ['bestseller', 'vegetarian'], isNew: false },
  { id: 11, name: 'BBQ Pulled Pork', category: 'Grills', price: 1100, rating: 4.6, prepTime: '20 min', calories: 590, image: '🌮', description: 'Slow-smoked pulled pork with house BBQ sauce, coleslaw, pickled jalapeños in a toasted brioche bun.', tags: ['popular', 'spicy'], isNew: false },
  { id: 12, name: 'Pad Thai Noodles', category: 'Asian', price: 790, rating: 4.5, prepTime: '20 min', calories: 460, image: '🍜', description: 'Wok-fried rice noodles with shrimp, tofu, bean sprouts, peanuts, and classic tamarind sauce.', tags: ['popular'], isNew: false },
]

export function useApi() {
  // ---- Reactive State ----
  const allFoods = ref([])          // full unfiltered dataset
  const isLoading = ref(false)      // loading spinner control
  const error = ref(null)           // error message

  // ---- Filter & Pagination State ----
  const searchQuery = ref('')       // text search
  const selectedCategory = ref('All') // category filter
  const currentPage = ref(1)        // current pagination page
  const itemsPerPage = ref(6)       // items shown per page

  // ---- COMPUTED: Filtered foods based on search + category ----
  // LEARNING #2: computed() auto-recalculates when dependencies change
  const filteredFoods = computed(() => {
    let result = allFoods.value

    // Filter by category
    if (selectedCategory.value !== 'All') {
      result = result.filter(food => food.category === selectedCategory.value)
    }

    // Filter by search query (case-insensitive match on name or category)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(food =>
        food.name.toLowerCase().includes(query) ||
        food.category.toLowerCase().includes(query)
      )
    }

    return result
  })

  // ---- COMPUTED: Total pages for pagination ----
  const totalPages = computed(() =>
    Math.ceil(filteredFoods.value.length / itemsPerPage.value)
  )

  // ---- COMPUTED: Slice of foods for current page ----
  const paginatedFoods = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredFoods.value.slice(start, end)
  })

  // ---- COMPUTED: All unique categories ----
  const categories = computed(() => {
    const cats = [...new Set(allFoods.value.map(f => f.category))]
    return ['All', ...cats.sort()]
  })

  // ---- WATCH: Reset to page 1 when filter/search changes ----
  // LEARNING #2: watch() reacts to changes in reactive refs
  watch([searchQuery, selectedCategory], () => {
    currentPage.value = 1  // always go back to page 1 on new filter
  })

  // ---- ACTION: Simulate API fetch ----
  const fetchFoods = async () => {
    isLoading.value = true
    error.value = null
    try {
      // Simulate network delay (replace with real fetch in production)
      await new Promise(resolve => setTimeout(resolve, 600))
      allFoods.value = MOCK_FOODS
    } catch (err) {
      error.value = 'Failed to load menu. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  // ---- ACTION: Get a single food by id ----
  const getFoodById = (id) => {
    return allFoods.value.find(food => food.id === Number(id)) || null
  }

  return {
    // State
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    currentPage,
    itemsPerPage,
    // Computed
    filteredFoods,
    paginatedFoods,
    totalPages,
    categories,
    // Actions
    fetchFoods,
    getFoodById,
  }
}
