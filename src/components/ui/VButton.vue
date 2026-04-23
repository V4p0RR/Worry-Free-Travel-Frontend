<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost | outline | danger | subtle
  size: { type: String, default: 'md' }, // sm | md | lg
  block: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' }
})
</script>

<template>
  <button
    :type="type"
    class="v-btn"
    :class="[`v-btn--${variant}`, `v-btn--${size}`, { 'v-btn--block': block, 'v-btn--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="v-btn__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-weight: 500;
  border-radius: var(--radius-pill);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease), opacity var(--dur) var(--ease);
  border: 1px solid transparent;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}
.v-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.v-btn--sm { padding: 6px 14px; font-size: var(--text-sm); min-height: 30px; }
.v-btn--md { padding: 9px 18px; font-size: var(--text-base); min-height: 38px; }
.v-btn--lg { padding: 12px 22px; font-size: var(--text-md); min-height: 44px; }
.v-btn--block { width: 100%; }

.v-btn--primary { background: var(--accent); color: var(--fg-on-accent); }
.v-btn--primary:hover:not(:disabled) { background: var(--accent-hover); }

.v-btn--ghost { background: transparent; color: var(--fg); }
.v-btn--ghost:hover:not(:disabled) { background: var(--bg-sunk); }

.v-btn--outline { background: transparent; color: var(--fg); border-color: var(--border-strong); }
.v-btn--outline:hover:not(:disabled) { background: var(--bg-sunk); border-color: var(--fg-subtle); }

.v-btn--subtle { background: var(--bg-sunk); color: var(--fg); }
.v-btn--subtle:hover:not(:disabled) { background: var(--border); }

.v-btn--danger { background: transparent; color: var(--danger); border-color: rgba(196, 69, 54, 0.3); }
.v-btn--danger:hover:not(:disabled) { background: rgba(196, 69, 54, 0.08); }

.v-btn__spinner {
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
