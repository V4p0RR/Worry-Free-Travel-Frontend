<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as userApi from '@/api/user'
import * as blogApi from '@/api/blog'
import * as followApi from '@/api/follow'
import { useAuthStore } from '@/stores/auth'
import VAvatar from '@/components/ui/VAvatar.vue'
import VTabs from '@/components/ui/VTabs.vue'
import FollowButton from '@/components/business/FollowButton.vue'
import UserMini from '@/components/business/UserMini.vue'
import BlogCard from '@/components/business/BlogCard.vue'

const route = useRoute()
const auth = useAuthStore()

const user = ref(null)
const info = ref(null)
const blogs = ref([])
const commonFollow = ref([])
const activeTab = ref('1')
const tabs = [
  { key: '1', label: '笔记' },
  { key: '2', label: '共同关注' }
]

async function loadAll(id) {
  try {
    const u = await userApi.getUserById(id)
    user.value = u.data
  } catch (_) {}
  try {
    const i = await userApi.getUserInfo(id)
    info.value = i.data
  } catch (_) {}
  try {
    const b = await blogApi.byUser(id, 1)
    blogs.value = b.data || []
  } catch (_) {}
}

async function loadCommon(id) {
  if (!auth.isLoggedIn) return
  try {
    const res = await followApi.common(id)
    commonFollow.value = res.data || []
  } catch (_) {}
}

function onTabChange(k) {
  if (k === '2' && commonFollow.value.length === 0) loadCommon(route.params.id)
}

watch(() => route.params.id, (id) => {
  if (id) {
    user.value = null
    info.value = null
    blogs.value = []
    commonFollow.value = []
    activeTab.value = '1'
    loadAll(id)
  }
}, { immediate: true })
</script>

<template>
  <div v-if="user" class="user">
    <section class="card">
      <div class="card__top">
        <VAvatar :src="user.icon" :size="72" />
        <div class="card__meta">
          <h1 class="card__name serif">{{ user.nickName }}</h1>
          <p class="muted text-sm">
            {{ info?.introduce || '这个人很懒，什么都没有留下' }}
          </p>
          <div class="card__chips">
            <span v-if="info?.city" class="chip">📍 {{ info.city }}</span>
            <span v-if="info?.level" class="chip">Lv.{{ info.level }}</span>
            <span v-if="info" class="chip">{{ info.fans || 0 }} 粉丝</span>
            <span v-if="info" class="chip">{{ info.followee || 0 }} 关注</span>
          </div>
        </div>
        <div>
          <FollowButton :user-id="user.id" />
        </div>
      </div>
    </section>

    <VTabs v-model="activeTab" :items="tabs" @change="onTabChange" />

    <div v-show="activeTab === '1'" class="tab-panel">
      <div v-if="blogs.length" class="blog-grid">
        <BlogCard v-for="b in blogs" :key="b.id" :blog="b" />
      </div>
      <div v-else class="empty muted">TA 还没有发布笔记</div>
    </div>

    <div v-show="activeTab === '2'" class="tab-panel">
      <div v-if="commonFollow.length" class="common-list">
        <UserMini v-for="u in commonFollow" :key="u.id" :user="u" />
      </div>
      <div v-else class="empty muted">
        {{ auth.isLoggedIn ? '你们还没有共同关注的旅人' : '登录后可以查看共同关注' }}
      </div>
    </div>
  </div>
  <div v-else class="loading muted">正在加载…</div>
</template>

<style scoped>
.user { display: flex; flex-direction: column; gap: var(--space-5); }
.loading { text-align: center; padding: var(--space-7); }

.card {
  background: linear-gradient(135deg, #f5efe0 0%, var(--bg-elevated) 60%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.card__top { display: grid; grid-template-columns: auto 1fr auto; gap: var(--space-4); align-items: center; }
.card__name { font-size: var(--text-2xl); margin-bottom: 2px; }
.card__chips { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-2); }
.chip {
  padding: 3px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--fg-muted);
}

.tab-panel { min-height: 200px; }
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}
.common-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.empty { padding: var(--space-7); text-align: center; border: 1px dashed var(--border); border-radius: var(--radius-md); }

@media (max-width: 640px) {
  .card__top { grid-template-columns: auto 1fr; }
  .card__top > :last-child { grid-column: span 2; justify-self: end; }
}
</style>
