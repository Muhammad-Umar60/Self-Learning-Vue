// ============================================================
// main.js — Entry Point
// LEARNING #3: Pinia is registered globally here so any
// component can access the store without importing createPinia again.
// LEARNING #4: Vue Router is registered globally here.
// ============================================================

import { createApp } from 'vue'
import { createPinia } from 'pinia'        // Global state manager
import router from './router/index.js'     // Our route definitions
import App from './App.vue'

const app = createApp(App)

// Register Pinia (must be before router if guards use stores)
app.use(createPinia())

// Register Vue Router
app.use(router)

app.mount('#app')
