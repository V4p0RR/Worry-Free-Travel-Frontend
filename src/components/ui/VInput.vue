<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  size: { type: String, default: 'md' },
  prefixIcon: { type: String, default: '' },
  suffixIcon: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: true }
})
defineEmits(['update:modelValue', 'enter'])
</script>

<template>
  <label class="v-input" :class="[`v-input--${size}`, { 'v-input--block': block, 'v-input--disabled': disabled }]">
    <span v-if="prefixIcon" class="v-input__icon v-input__icon--prefix">{{ prefixIcon }}</span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('enter')"
    />
    <span v-if="suffixIcon" class="v-input__icon v-input__icon--suffix">{{ suffixIcon }}</span>
    <slot name="suffix" />
  </label>
</template>

<style scoped>
.v-input {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
  padding: 0 var(--space-3);
}
.v-input--block { display: flex; width: 100%; }
.v-input--sm { min-height: 32px; font-size: var(--text-sm); }
.v-input--md { min-height: 40px; font-size: var(--text-base); }
.v-input--lg { min-height: 48px; font-size: var(--text-md); }
.v-input:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }
.v-input--disabled { opacity: 0.6; cursor: not-allowed; }

.v-input input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  min-width: 0;
}
.v-input input::placeholder { color: var(--fg-subtle); }
.v-input__icon { color: var(--fg-subtle); font-size: var(--text-base); }
</style>
