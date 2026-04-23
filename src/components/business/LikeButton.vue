<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as blogApi from '@/api/blog'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  blogId: { type: [Number, String], required: true },
  liked: { type: Boolean, default: false },
  count: { type: Number, default: 0 }
})
const emit = defineEmits(['update:liked', 'update:count', 'change'])

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)

async function toggle() {
  if (!auth.isLoggedIn) {
    window.$message?.info('请先登录')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  if (loading.value) return
  loading.value = true
  try {
    await blogApi.like(props.blogId)
    const newLiked = !props.liked
    const newCount = (props.count || 0) + (newLiked ? 1 : -1)
    emit('update:liked', newLiked)
    emit('update:count', Math.max(newCount, 0))
    emit('change', newLiked)
  } catch (_) {
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button class="like-btn" :class="{ 'is-liked': liked }" :disabled="loading" @click="toggle">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z"
        :fill="liked ? 'currentColor' : 'none'" />
    </svg>
    <span>{{ count || 0 }}</span>
  </button>
</template>

<style scoped>
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  color: var(--fg-muted);
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease);
  font-size: var(--text-sm);
}
.like-btn:hover { color: var(--accent); border-color: rgba(201, 100, 66, 0.3); }
.like-btn.is-liked { color: var(--accent); background: var(--accent-soft); border-color: transparent; }
</style>
