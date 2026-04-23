<script setup>
import { computed } from 'vue'
import { resolveImg } from '@/utils/format'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: [String, Number], default: 36 }
})
const fallback = '/imgs/icons/default-icon.png'
const resolved = computed(() => resolveImg(props.src) || fallback)
</script>

<template>
  <span class="v-avatar" :style="{ width: size + 'px', height: size + 'px' }">
    <img :src="resolved" :alt="alt" @error="(e) => { e.target.onerror = null; e.target.src = fallback }" />
  </span>
</template>

<style scoped>
.v-avatar {
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  background: var(--bg-sunk);
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.v-avatar img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
</style>
