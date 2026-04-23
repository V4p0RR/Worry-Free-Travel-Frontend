<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
let uid = 0

function push(type, text, duration = 2600) {
  const id = ++uid
  items.value.push({ id, type, text })
  setTimeout(() => {
    items.value = items.value.filter((it) => it.id !== id)
  }, duration)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.$message = {
      success: (t) => push('success', t),
      error: (t) => push('error', t),
      info: (t) => push('info', t),
      warning: (t) => push('warning', t)
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="v-message">
      <TransitionGroup name="msg">
        <div
          v-for="it in items"
          :key="it.id"
          class="v-message__item"
          :class="`v-message__item--${it.type}`"
        >
          <span class="v-message__dot" />
          <span>{{ it.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.v-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}
.v-message__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 10px 16px;
  font-size: var(--text-sm);
  color: var(--fg);
  pointer-events: auto;
  min-width: 200px;
  max-width: 80vw;
}
.v-message__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--fg-subtle);
}
.v-message__item--success .v-message__dot { background: var(--success); }
.v-message__item--error .v-message__dot { background: var(--danger); }
.v-message__item--warning .v-message__dot { background: var(--warning); }
.v-message__item--info .v-message__dot { background: var(--info); }

.msg-enter-active, .msg-leave-active { transition: all var(--dur) var(--ease); }
.msg-enter-from { opacity: 0; transform: translateY(-12px); }
.msg-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
