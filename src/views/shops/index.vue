<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as shopApi from '@/api/shop'
import * as shopTypeApi from '@/api/shopType'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'
import ShopCard from '@/components/business/ShopCard.vue'

const route = useRoute()
const router = useRouter()

const types = ref([])
const currentType = ref(null)
const keyword = ref('')
const shops = ref([])
const page = ref(1)
const loading = ref(false)
const reachedEnd = ref(false)

// 默认杭州坐标
const COORD = { x: 120.149993, y: 30.334229 }

async function loadTypes() {
  try {
    const res = await shopTypeApi.listTypes()
    types.value = res.data || []
    applyRouteType()
  } catch (_) {}
}

function applyRouteType() {
  const qid = Number(route.query.typeId)
  if (qid) {
    currentType.value = types.value.find((t) => t.id === qid) || null
  } else if (types.value.length && !currentType.value) {
    currentType.value = types.value[0]
  }
}

function reset() {
  shops.value = []
  page.value = 1
  reachedEnd.value = false
}

async function loadMore() {
  if (loading.value || reachedEnd.value) return
  loading.value = true
  try {
    let res
    if (keyword.value.trim()) {
      res = await shopApi.searchByName({ name: keyword.value.trim(), current: page.value })
    } else if (currentType.value) {
      res = await shopApi.listByType({ typeId: currentType.value.id, current: page.value, ...COORD })
    } else {
      return
    }
    const list = res.data || []
    if (list.length === 0) reachedEnd.value = true
    else {
      shops.value = shops.value.concat(list)
      page.value += 1
    }
  } catch (_) {
  } finally {
    loading.value = false
  }
}

function pickType(t) {
  currentType.value = t
  keyword.value = ''
  router.replace({ query: { typeId: t.id } })
  reset()
  loadMore()
}

function search() {
  reset()
  loadMore()
}

onMounted(loadTypes)
watch(currentType, (v) => {
  if (v && shops.value.length === 0) loadMore()
})
</script>

<template>
  <div class="shops">
    <header class="shops__head">
      <div>
        <h1 class="serif">店铺</h1>
        <p class="muted">挑选一家，留下你的足迹</p>
      </div>
      <div class="shops__search">
        <VInput
          v-model="keyword"
          placeholder="按名称搜索店铺…"
          size="md"
          @enter="search"
        />
        <VButton @click="search">搜索</VButton>
      </div>
    </header>

    <nav class="type-bar">
      <button
        v-for="t in types"
        :key="t.id"
        class="type-bar__chip"
        :class="{ 'is-active': currentType?.id === t.id && !keyword }"
        @click="pickType(t)"
      >
        {{ t.name }}
      </button>
    </nav>

    <section class="shop-list">
      <ShopCard v-for="s in shops" :key="s.id" :shop="s" />
      <div v-if="!loading && shops.length === 0" class="empty muted">
        暂时没有匹配的店铺～试试其他关键词？
      </div>
    </section>

    <div class="shops__foot">
      <button v-if="!reachedEnd" class="load-more" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : '加载更多' }}
      </button>
      <span v-else-if="shops.length" class="subtle text-sm">到底啦</span>
    </div>
  </div>
</template>

<style scoped>
.shops { display: flex; flex-direction: column; gap: var(--space-5); }
.shops__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-5);
  flex-wrap: wrap;
}
.shops__head h1 { font-size: var(--text-3xl); }
.shops__search { display: flex; gap: var(--space-2); min-width: 320px; }
.shops__search :deep(.v-input) { flex: 1; }

.type-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border);
}
.type-bar__chip {
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg-muted);
  font-size: var(--text-sm);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.type-bar__chip:hover { color: var(--fg); border-color: var(--border-strong); }
.type-bar__chip.is-active {
  background: var(--fg);
  color: var(--bg);
  border-color: var(--fg);
}

.shop-list { display: flex; flex-direction: column; gap: var(--space-3); }
.empty { text-align: center; padding: var(--space-7); }

.shops__foot { display: flex; justify-content: center; margin-top: var(--space-3); }
.load-more {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  color: var(--fg);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}
.load-more:hover:not(:disabled) { background: var(--bg-sunk); }
</style>
