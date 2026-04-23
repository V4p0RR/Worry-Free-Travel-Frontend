<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
  padding: { type: String, default: 'md' }, // none | sm | md | lg
  flat: { type: Boolean, default: false }
})
</script>

<template>
  <div
    class="v-card"
    :class="[`v-card--p-${padding}`, { 'v-card--hover': hoverable, 'v-card--flat': flat }]"
  >
    <slot />
  </div>
</template>

<style scoped>
.v-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.v-card--flat { background: transparent; box-shadow: none; }
.v-card--p-none { padding: 0; }
.v-card--p-sm { padding: var(--space-3); }
.v-card--p-md { padding: var(--space-4); }
.v-card--p-lg { padding: var(--space-5); }
.v-card--hover:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--border-strong); }
</style>
