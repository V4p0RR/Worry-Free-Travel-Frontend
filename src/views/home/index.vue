<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as shopTypeApi from '@/api/shopType'
import * as blogApi from '@/api/blog'
import BlogCard from '@/components/business/BlogCard.vue'
import { resolveImg } from '@/utils/format'

const router = useRouter()
const types = ref([])
const blogs = ref([])
const page = ref(1)
const loading = ref(false)
const reachedEnd = ref(false)

async function loadTypes() {
  try {
    const res = await shopTypeApi.listTypes()
    types.value = res.data || []
  } catch (_) {}
}

async function loadMore() {
  if (loading.value || reachedEnd.value) return
  loading.value = true
  try {
    const res = await blogApi.hot(page.value)
    const list = res.data || []
    if (list.length === 0) reachedEnd.value = true
    else {
      blogs.value = blogs.value.concat(list)
      page.value += 1
    }
  } catch (_) {
  } finally {
    loading.value = false
  }
}

function goType(t) {
  router.push({ path: '/shops', query: { typeId: t.id, name: t.name } })
}

onMounted(() => {
  loadTypes()
  loadMore()
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero__tag">发现 · 记录 · 分享</div>
      <h1 class="hero__title serif">在身边的街巷里，<br />遇见一段无忧的旅程。</h1>
      <p class="hero__sub muted">
        找一家心仪的店，留下一篇动人的笔记，让旅人之间的相遇变得更简单。
      </p>
      <div class="hero__actions">
        <button class="hero__cta" @click="router.push('/shops')">开始探索</button>
        <button class="hero__link" @click="router.push('/publish')">写一篇笔记 →</button>
      </div>
    </section>

    <section class="section">
      <header class="section__head">
        <h2 class="serif">浏览分类</h2>
        <span class="subtle text-sm">从熟悉的类别开始</span>
      </header>
      <div class="type-grid">
        <button v-for="t in types" :key="t.id" class="type-tile" @click="goType(t)">
          <div class="type-tile__icon">
            <img v-if="t.icon" :src="resolveImg(t.icon, '/types')" :alt="t.name" @error="(e) => e.target.style.display = 'none'" />
          </div>
          <span class="type-tile__name">{{ t.name }}</span>
        </button>
      </div>
    </section>

    <section class="section">
      <header class="section__head">
        <h2 class="serif">热门笔记</h2>
        <span class="subtle text-sm">最近被喜欢最多的片段</span>
      </header>
      <div class="blog-grid">
        <BlogCard v-for="b in blogs" :key="b.id" :blog="b" />
      </div>
      <div class="section__foot">
        <button v-if="!reachedEnd" class="load-more" :disabled="loading" @click="loadMore">
          {{ loading ? '加载中…' : '加载更多' }}
        </button>
        <span v-else class="subtle text-sm">没有更多了～</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home { display: flex; flex-direction: column; gap: var(--space-7); }

.hero {
  padding: var(--space-7) var(--space-6);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #f5efe0 0%, var(--bg) 70%);
  border: 1px solid var(--border);
}
.hero__tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  letter-spacing: 0.05em;
}
.hero__title {
  margin-top: var(--space-4);
  font-size: var(--text-4xl);
  line-height: 1.15;
  max-width: 680px;
}
.hero__sub {
  margin-top: var(--space-4);
  max-width: 560px;
  font-size: var(--text-md);
}
.hero__actions { margin-top: var(--space-5); display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.hero__cta {
  padding: 12px 24px;
  background: var(--accent);
  color: var(--fg-on-accent);
  border-radius: var(--radius-pill);
  font-weight: 500;
  transition: background var(--dur) var(--ease);
}
.hero__cta:hover { background: var(--accent-hover); }
.hero__link { color: var(--fg); font-size: var(--text-sm); padding: 12px 4px; }
.hero__link:hover { color: var(--accent); }

.section__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.section__head h2 { font-size: var(--text-2xl); }

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: var(--space-3);
}
.type-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease);
  color: var(--fg);
}
.type-tile:hover { transform: translateY(-2px); border-color: var(--border-strong); }
.type-tile__icon {
  width: 48px; height: 48px;
  border-radius: var(--radius);
  background: var(--bg-sunk);
  display: flex; align-items: center; justify-content: center;
}
.type-tile__icon img { width: 32px; height: 32px; object-fit: contain; }
.type-tile__name { font-size: var(--text-sm); font-weight: 500; }

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.section__foot {
  margin-top: var(--space-5);
  display: flex; justify-content: center;
}
.load-more {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  color: var(--fg);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  transition: background var(--dur) var(--ease);
}
.load-more:hover:not(:disabled) { background: var(--bg-sunk); }
</style>
