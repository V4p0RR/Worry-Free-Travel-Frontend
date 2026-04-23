<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '520px' }
})
const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  (v) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = v ? 'hidden' : ''
    }
  }
)

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" class="v-dialog__mask" @click.self="close">
        <div class="v-dialog" :style="{ width }">
          <header v-if="title || $slots.header" class="v-dialog__header">
            <slot name="header">
              <h3>{{ title }}</h3>
            </slot>
            <button class="v-dialog__close" @click="close" aria-label="关闭">×</button>
          </header>
          <div class="v-dialog__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="v-dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.v-dialog__mask {
  position: fixed; inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-5);
}
.v-dialog {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.v-dialog__header {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.v-dialog__header h3 { font-size: var(--text-lg); font-weight: 500; }
.v-dialog__close {
  font-size: 24px;
  line-height: 1;
  color: var(--fg-subtle);
  width: 32px; height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background var(--dur) var(--ease);
}
.v-dialog__close:hover { background: var(--bg-sunk); color: var(--fg); }
.v-dialog__body { padding: var(--space-5); overflow: auto; }
.v-dialog__footer {
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.dialog-enter-active, .dialog-leave-active { transition: opacity var(--dur) var(--ease); }
.dialog-enter-active .v-dialog, .dialog-leave-active .v-dialog { transition: transform var(--dur) var(--ease); }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }
.dialog-enter-from .v-dialog, .dialog-leave-to .v-dialog { transform: scale(0.96); }
</style>
