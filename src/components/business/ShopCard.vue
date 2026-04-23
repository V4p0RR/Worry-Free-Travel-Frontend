<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VRate from '@/components/ui/VRate.vue'
import { splitImages, formatDistance } from '@/utils/format'

const props = defineProps({ shop: { type: Object, required: true } })
const router = useRouter()

const cover = computed(() => splitImages(props.shop.images)[0] || '')
const score = computed(() => (props.shop.score ? props.shop.score / 10 : 0))

function go() {
  router.push(`/shop/${props.shop.id}`)
}
</script>

<template>
  <article class="shop-card" @click="go">
    <div class="shop-card__cover">
      <img v-if="cover" :src="cover" :alt="shop.name" />
    </div>
    <div class="shop-card__body">
      <div class="shop-card__head">
        <h4 class="shop-card__name truncate">{{ shop.name }}</h4>
        <span v-if="shop.distance" class="text-xs subtle">{{ formatDistance(shop.distance) }}</span>
      </div>
      <div class="shop-card__rate">
        <VRate :value="score" show-score :size="13" />
        <span class="text-xs subtle">{{ shop.comments || 0 }} 条评价</span>
      </div>
      <div class="shop-card__meta text-xs subtle">
        <span v-if="shop.area">{{ shop.area }}</span>
        <span v-if="shop.avgPrice">￥{{ shop.avgPrice }}/人</span>
      </div>
      <div v-if="shop.address" class="shop-card__address text-xs muted truncate">
        {{ shop.address }}
      </div>
    </div>
  </article>
</template>

<style scoped>
.shop-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.shop-card:hover { border-color: var(--border-strong); background: var(--bg-sunk); }
.shop-card__cover {
  width: 120px; height: 120px;
  background: var(--bg-sunk);
  border-radius: var(--radius);
  overflow: hidden;
}
.shop-card__cover img { width: 100%; height: 100%; object-fit: cover; }
.shop-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 0;
}
.shop-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}
.shop-card__name { font-size: var(--text-md); font-weight: 500; font-family: var(--font-sans); }
.shop-card__rate { display: flex; align-items: center; gap: var(--space-3); }
.shop-card__meta { display: flex; gap: var(--space-3); }
.shop-card__address { margin-top: auto; }
</style>
