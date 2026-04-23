<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 }, // 0~5
  max: { type: Number, default: 5 },
  size: { type: Number, default: 14 },
  showScore: { type: Boolean, default: false }
})

const stars = computed(() => {
  const arr = []
  const full = Math.floor(props.value)
  const half = props.value - full >= 0.5
  for (let i = 0; i < props.max; i++) {
    if (i < full) arr.push('full')
    else if (i === full && half) arr.push('half')
    else arr.push('empty')
  }
  return arr
})
</script>

<template>
  <span class="v-rate">
    <svg
      v-for="(s, i) in stars"
      :key="i"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      :class="['v-rate__star', `v-rate__star--${s}`]"
    >
      <defs>
        <linearGradient :id="`half-${i}`">
          <stop offset="50%" stop-color="currentColor" />
          <stop offset="50%" stop-color="var(--border)" stop-opacity="1" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5l2.95 6.2 6.55.92-4.75 4.8 1.13 6.73L12 17.95 6.12 21.15 7.25 14.42 2.5 9.62l6.55-.92z"
        :fill="s === 'full' ? 'currentColor' : s === 'half' ? `url(#half-${i})` : 'var(--border)'"
      />
    </svg>
    <span v-if="showScore" class="v-rate__score">{{ value.toFixed(1) }}</span>
  </span>
</template>

<style scoped>
.v-rate {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--accent);
}
.v-rate__score {
  margin-left: var(--space-2);
  font-size: var(--text-sm);
  color: var(--accent);
  font-weight: 500;
}
</style>
