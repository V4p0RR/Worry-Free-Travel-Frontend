<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, required: true } // [{ key, label }]
})
defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <div class="v-tabs">
    <div class="v-tabs__bar" role="tablist">
      <button
        v-for="it in items"
        :key="it.key"
        class="v-tabs__tab"
        :class="{ 'is-active': modelValue === it.key }"
        role="tab"
        @click="() => { $emit('update:modelValue', it.key); $emit('change', it.key) }"
      >
        {{ it.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.v-tabs__bar {
  display: inline-flex;
  gap: var(--space-4);
  border-bottom: 1px solid var(--border);
}
.v-tabs__tab {
  position: relative;
  padding: var(--space-3) var(--space-1);
  color: var(--fg-muted);
  font-size: var(--text-base);
  border-bottom: 2px solid transparent;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
  margin-bottom: -1px;
}
.v-tabs__tab:hover { color: var(--fg); }
.v-tabs__tab.is-active {
  color: var(--fg);
  border-bottom-color: var(--accent);
  font-weight: 500;
}
</style>
