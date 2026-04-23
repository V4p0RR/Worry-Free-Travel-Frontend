<script setup>
import { ref, onMounted } from 'vue'
import * as blogApi from '@/api/blog'
import BlogCard from '@/components/business/BlogCard.vue'

const blogs = ref([])
const page = ref(1)
const loading = ref(false)
const reachedEnd = ref(false)

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

onMounted(loadMore)
</script>

<template>
  <div class="blogs">
    <header class="blogs__head">
      <div>
        <h1 class="serif">热门笔记</h1>
        <p class="muted">每一篇都是一次亲历</p>
      </div>
    </header>
    <div class="blog-grid">
      <BlogCard v-for="b in blogs" :key="b.id" :blog="b" />
    </div>
    <div class="foot">
      <button v-if="!reachedEnd" class="load-more" :disabled="loading" @click="loadMore">
        {{ loading ? '加载中…' : '加载更多' }}
      </button>
      <span v-else class="subtle text-sm">到底啦～</span>
    </div>
  </div>
</template>

<style scoped>
.blogs { display: flex; flex-direction: column; gap: var(--space-5); }
.blogs__head h1 { font-size: var(--text-3xl); }
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.foot { display: flex; justify-content: center; margin-top: var(--space-4); }
.load-more {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}
.load-more:hover:not(:disabled) { background: var(--bg-sunk); }
</style>
