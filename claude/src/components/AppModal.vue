<!-- ============================================================
  AppModal.vue
  LEARNING #2: Reusable Modal using Slots & Composition API

  Concepts demonstrated:
   - Named slots: #header, #default (body), #footer
   - Slot fallback content (shown when no slot content provided)
   - watch() to lock body scroll when modal is open
   - Teleport: renders modal outside the component tree (in <body>)
   - v-model pattern via modelValue prop + 'update:modelValue' emit
   - Transition animation for smooth open/close
============================================================ -->

<template>
  <!-- Teleport renders this into <body> directly, avoiding z-index/overflow issues -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container" :style="{ maxWidth: width }">

          <!-- CLOSE BUTTON -->
          <button class="modal-close" @click="closeModal">✕</button>

          <!-- NAMED SLOT: header -->
          <!-- Parent can fill this with custom header content -->
          <div class="modal-header">
            <slot name="header">
              <!-- Fallback content if no header slot provided -->
              <h2 class="modal-title">{{ title }}</h2>
            </slot>
          </div>

          <!-- DEFAULT SLOT: body -->
          <!-- The main content goes here -->
          <div class="modal-body">
            <slot>
              <p>No content provided.</p>
            </slot>
          </div>

          <!-- NAMED SLOT: footer -->
          <!-- Parent can add action buttons here -->
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

// ---- PROPS ----
// v-model support: parent uses <AppModal v-model="showModal" />
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Details'
  },
  width: {
    type: String,
    default: '500px'   // customizable modal width
  }
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}

// LEARNING #2: watch() — lock body scroll when modal is open
// This is a real-world use case for watch()
watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--card-bg);
  border-radius: 24px;
  width: 100%;
  position: relative;
  border: 1px solid var(--border);
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.2s;
}
.modal-close:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.modal-header { padding: 28px 28px 0; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text-primary); margin: 0; }

.modal-body { padding: 20px 28px; }

.modal-footer {
  padding: 16px 28px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--border);
}

/* ---- Transition ---- */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-container {
  transform: translateY(20px) scale(0.96);
}
</style>
