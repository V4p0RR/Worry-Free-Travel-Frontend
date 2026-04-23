<script setup>
import { ref, onMounted } from 'vue'
import * as blogApi from '@/api/blog'
import BlogCard from '@/components/business/BlogCard.vue'

const blogs = ref([])
const loading = ref(false)
const reachedEnd = ref(false)
const cursor = ref({ lastId: Date.now(), offset: 0 })

async function loadMore() {
  if (loading.value || reachedEnd.value) return
  loading.value = true
  try {
    const res = await blogApi.follow({ lastId: cursor.value.lastId, offset: cursor.value.offset })
    const data = res.data
    if (!data || !data.list || data.list.length === 0) {
      reachedEnd.value = true
    } else {
      blogs.value = blogs.value.concat(data.list)
      cursor.value = { lastId: data.minTime, offset: data.offset }
    }
  } catch (_) {
  } finally {
    loading.value = false
  }
}

function refresh() {
  blogs.value = []
  cursor.value = { lastId: Date.now(), offset: 0 }
  reachedEnd.value = false
  loadMore()
}

onMounted(loadMore)
</script>

<template>
  <div class="feed">
    <header class="feed__head">
      <div>
        <h1 class="serif">关注动态</h1>
        <p class="muted">来自你关注的旅人的最新笔记</p>
      </div>
      <button class="refresh" @click="refresh">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 4v6h-6M1 20v-6h6M3.5 9A9 9 0 0 1 18.4 5.6L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" />
        </svg>
        <span>刷新</span>
      </button>
    </header>

    <div v-if="blogs.length" class="blog-grid">
      <BlogCard v-for="b in blogs" :key="b.id" :blog="b" />
    </div>
    <div v-else-if="!loading" class="empty">
      <div class="empty__icon">☕</div>
      <div class="empty__title serif">还没有新内容</div>
      <p class="muted">去关注一些你感兴趣的旅人吧～</p>
    </div>

    <div class="foot">
      <button v-if="!reachedEnd && blogs.length" class="load-more" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : '加载更多' }}
      </button>
      <span v-else-if="reachedEnd && blogs.length" class="subtle text-sm">到底啦</span>
    </div>
  </div>
</template>

<style scoped>
.feed { display: flex; flex-direction: column; gap: var(--space-5); }
.feed__head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-4); flex-wrap: wrap; }
.feed__head h1 { font-size: var(--text-3xl); }
.refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  color: var(--fg-muted);
  font-size: var(--text-sm);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.refresh:hover { background: var(--bg-sunk); color: var(--fg); }

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.empty {
  padding: var(--space-8) var(--space-5);
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
}
.empty__icon { font-size: 40px; margin-bottom: var(--space-2); }
.empty__title { font-size: var(--text-xl); margin-bottom: var(--space-2); }

.foot { display: flex; justify-content: center; }
.load-more {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}
.load-more:hover:not(:disabled) { background: var(--bg-sunk); }
</style>
