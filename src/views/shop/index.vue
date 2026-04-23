<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as shopApi from '@/api/shop'
import * as voucherApi from '@/api/voucher'
import * as voucherOrderApi from '@/api/voucherOrder'
import VRate from '@/components/ui/VRate.vue'
import VoucherCard from '@/components/business/VoucherCard.vue'
import { splitImages } from '@/utils/format'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const shop = ref(null)
const images = ref([])
const vouchers = ref([])

async function loadShop(id) {
  try {
    const res = await shopApi.getShop(id)
    shop.value = res.data
    images.value = splitImages(res.data?.images)
  } catch (_) {}
}
async function loadVouchers(id) {
  try {
    const res = await voucherApi.listByShop(id)
    vouchers.value = res.data || []
  } catch (_) {}
}

async function seckill(v) {
  if (!auth.isLoggedIn) {
    window.$message?.info('请先登录')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  try {
    const res = await voucherOrderApi.seckill(v.id)
    window.$message?.success(`抢购成功！订单号：${res.data}`)
    loadVouchers(shop.value.id)
  } catch (_) {}
}

const score = computed(() => (shop.value?.score ? shop.value.score / 10 : 0))

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      loadShop(id)
      loadVouchers(id)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="shop" class="shop-detail">
    <div class="hero">
      <div v-if="images.length" class="hero__cover">
        <img :src="images[0]" :alt="shop.name" />
      </div>
      <div class="hero__meta">
        <h1 class="serif">{{ shop.name }}</h1>
        <div class="hero__rate">
          <VRate :value="score" show-score />
          <span class="subtle text-sm">· {{ shop.comments || 0 }} 条评价</span>
        </div>
        <div class="hero__tags">
          <span v-if="shop.area" class="chip">{{ shop.area }}</span>
          <span v-if="shop.avgPrice" class="chip">￥{{ shop.avgPrice }}/人</span>
          <span v-if="shop.openHours" class="chip">{{ shop.openHours }}</span>
        </div>
        <p v-if="shop.address" class="hero__addr muted">
          📍 {{ shop.address }}
        </p>
      </div>
    </div>

    <div v-if="images.length > 1" class="gallery">
      <img v-for="(img, i) in images.slice(1)" :key="i" :src="img" :alt="`img-${i}`" />
    </div>

    <section class="section">
      <h2 class="section__title serif">优惠券</h2>
      <div v-if="vouchers.length" class="voucher-list">
        <VoucherCard
          v-for="v in vouchers"
          :key="v.id"
          :voucher="v"
          @seckill="seckill"
        />
      </div>
      <div v-else class="muted text-sm">暂无优惠券</div>
    </section>

    <section class="section">
      <h2 class="section__title serif">评价</h2>
      <div class="comments-placeholder muted text-sm">
        评论功能建设中，敬请期待 🍃
      </div>
    </section>
  </div>
  <div v-else class="loading muted">正在加载店铺信息…</div>
</template>

<style scoped>
.shop-detail { display: flex; flex-direction: column; gap: var(--space-7); }
.loading { padding: var(--space-7); text-align: center; }

.hero {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  gap: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.hero__cover {
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-sunk);
}
.hero__cover img { width: 100%; height: 100%; object-fit: cover; }
.hero__meta { display: flex; flex-direction: column; gap: var(--space-3); }
.hero__meta h1 { font-size: var(--text-3xl); }
.hero__rate { display: flex; align-items: center; gap: var(--space-2); }
.hero__tags { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.chip {
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  background: var(--bg-sunk);
  color: var(--fg-muted);
  font-size: var(--text-xs);
}
.hero__addr { margin-top: auto; font-size: var(--text-sm); }

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-3);
}
.gallery img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--bg-sunk);
}

.section__title { font-size: var(--text-xl); margin-bottom: var(--space-4); }

.voucher-list { display: flex; flex-direction: column; gap: var(--space-3); }

.comments-placeholder {
  padding: var(--space-6);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  text-align: center;
}

@media (max-width: 800px) {
  .hero { grid-template-columns: 1fr; }
}
</style>
