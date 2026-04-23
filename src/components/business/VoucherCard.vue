<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VButton from '@/components/ui/VButton.vue'
import { formatPrice, formatDiscount, formatTimeRange } from '@/utils/format'

const props = defineProps({
  voucher: { type: Object, required: true },
  disabled: { type: Boolean, default: false }
})
const emit = defineEmits(['seckill'])

const isSeckill = computed(() => props.voucher.type === 1)
const now = ref(Date.now())
let timer = null

onMounted(() => {
  if (isSeckill.value) {
    timer = setInterval(() => (now.value = Date.now()), 1000)
  }
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const isNotBegin = computed(() => isSeckill.value && new Date(props.voucher.beginTime).getTime() > now.value)
const isEnd = computed(() => isSeckill.value && new Date(props.voucher.endTime).getTime() < now.value)
const noStock = computed(() => isSeckill.value && props.voucher.stock < 1)
const canBuy = computed(() => !isNotBegin.value && !isEnd.value && !noStock.value)

const btnLabel = computed(() => {
  if (!isSeckill.value) return '抢购'
  if (isNotBegin.value) return '未开始'
  if (isEnd.value) return '已结束'
  if (noStock.value) return '已抢光'
  return '限时抢购'
})

function onBuy() {
  if (!isSeckill.value) {
    window.$message?.info('普通券购买功能建设中')
    return
  }
  if (!canBuy.value) return
  emit('seckill', props.voucher)
}
</script>

<template>
  <div class="voucher" :class="{ 'voucher--seckill': isSeckill }">
    <div class="voucher__left">
      <div class="voucher__title">{{ voucher.title }}</div>
      <div v-if="voucher.subTitle" class="voucher__subtitle subtle text-sm">{{ voucher.subTitle }}</div>
      <div v-if="voucher.rules" class="voucher__rules muted text-xs">
        {{ voucher.rules.replace(/\\n/g, ' · ') }}
      </div>
      <div class="voucher__price">
        <span class="voucher__price-num">￥{{ formatPrice(voucher.payValue) }}</span>
        <span class="voucher__price-original">价值 ￥{{ formatPrice(voucher.actualValue) }}</span>
        <span class="voucher__discount">{{ formatDiscount(voucher.payValue, voucher.actualValue) }}</span>
      </div>
    </div>
    <div class="voucher__divider">
      <span v-for="i in 6" :key="i" class="voucher__notch" />
    </div>
    <div class="voucher__right">
      <div v-if="isSeckill" class="voucher__stock subtle text-xs">
        剩余 <strong>{{ voucher.stock }}</strong> 张
      </div>
      <div v-if="isSeckill" class="voucher__time subtle text-xs">
        {{ formatTimeRange(voucher.beginTime, voucher.endTime) }}
      </div>
      <VButton
        :variant="canBuy || !isSeckill ? 'primary' : 'subtle'"
        size="sm"
        :disabled="disabled || (isSeckill && !canBuy)"
        @click="onBuy"
      >
        {{ btnLabel }}
      </VButton>
    </div>
  </div>
</template>

<style scoped>
.voucher {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  align-items: center;
}
.voucher--seckill { border-color: rgba(201, 100, 66, 0.3); background: linear-gradient(135deg, #fdfbf4 0%, var(--bg-elevated) 60%); }
.voucher__left { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.voucher__title { font-size: var(--text-md); font-weight: 500; }
.voucher__rules { margin-top: 2px; }
.voucher__price {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.voucher__price-num { font-size: var(--text-xl); color: var(--accent); font-weight: 600; font-family: var(--font-serif); }
.voucher__price-original { color: var(--fg-subtle); text-decoration: line-through; font-size: var(--text-sm); }
.voucher__discount {
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
}
.voucher__divider {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
  padding: 4px 0;
}
.voucher__notch { width: 2px; height: 8px; background: var(--border); border-radius: 1px; }
.voucher__right { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; min-width: 120px; }
.voucher__time { max-width: 200px; text-align: right; }
</style>
