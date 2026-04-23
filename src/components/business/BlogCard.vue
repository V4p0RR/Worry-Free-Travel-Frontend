<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import VAvatar from '@/components/ui/VAvatar.vue'
import { splitImages } from '@/utils/format'

const props = defineProps({ blog: { type: Object, required: true } })
const router = useRouter()

const cover = computed(() => splitImages(props.blog.images)[0] || '')

function go() {
  router.push(`/blog/${props.blog.id}`)
}
function goAuthor(e) {
  e.stopPropagation()
  if (props.blog.userId) router.push(`/user/${props.blog.userId}`)
}
</script>

<template>
  <article class="blog-card" @click="go">
    <div class="blog-card__cover">
      <img v-if="cover" :src="cover" :alt="blog.title" />
      <div v-else class="blog-card__cover--placeholder">暂无图片</div>
    </div>
    <div class="blog-card__body">
      <h4 class="blog-card__title line-clamp-2">{{ blog.title || '未命名' }}</h4>
      <p v-if="blog.content" class="blog-card__content line-clamp-2 muted text-sm">
        {{ blog.content }}
      </p>
      <footer class="blog-card__foot">
        <button class="blog-card__author" @click="goAuthor">
          <VAvatar :src="blog.icon" :size="22" />
          <span class="truncate">{{ blog.name || '匿名' }}</span>
        </button>
        <span class="blog-card__likes">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
          </svg>
          {{ blog.liked || 0 }}
        </span>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.blog-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-strong); }
.blog-card__cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--bg-sunk);
  overflow: hidden;
}
.blog-card__cover img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease); }
.blog-card:hover .blog-card__cover img { transform: scale(1.03); }
.blog-card__cover--placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--fg-subtle); font-size: var(--text-sm);
}
.blog-card__body { padding: var(--space-3) var(--space-4) var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); }
.blog-card__title { font-size: var(--text-md); font-weight: 500; line-height: 1.4; font-family: var(--font-sans); }
.blog-card__content { line-height: 1.5; }
.blog-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-2);
}
.blog-card__author {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--fg-muted);
  font-size: var(--text-xs);
  max-width: 60%;
}
.blog-card__author:hover { color: var(--accent); }
.blog-card__likes {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--fg-subtle);
  font-size: var(--text-xs);
}
</style>
