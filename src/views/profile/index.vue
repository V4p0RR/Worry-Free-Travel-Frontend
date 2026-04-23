<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as userApi from '@/api/user'
import * as blogApi from '@/api/blog'
import VAvatar from '@/components/ui/VAvatar.vue'
import VButton from '@/components/ui/VButton.vue'
import VTabs from '@/components/ui/VTabs.vue'
import BlogCard from '@/components/business/BlogCard.vue'

const auth = useAuthStore()
const router = useRouter()

const info = ref(null)
const myBlogs = ref([])
const feedBlogs = ref([])
const feedCursor = ref({ lastId: Date.now(), offset: 0 })
const feedEnd = ref(false)

const signedCount = ref(0)
const signedToday = ref(false)
const signing = ref(false)

// sessionStorage 按用户+日期存，当日关闭页面再回来仍有效
function signKey() {
  const today = new Date().toISOString().slice(0, 10)
  return `signed_${auth.user?.id}_${today}`
}
function readSignedFromSession() {
  signedToday.value = sessionStorage.getItem(signKey()) === '1'
}

const tabs = [
  { key: '1', label: '我的笔记' },
  { key: '2', label: '关注动态' }
]
const activeTab = ref('1')

async function loadInfo() {
  if (!auth.user?.id) return
  try {
    const res = await userApi.getUserInfo(auth.user.id)
    info.value = res.data || null
  } catch (_) {}
}

async function loadBlogs() {
  try {
    const res = await blogApi.mine(1)
    myBlogs.value = res.data || []
  } catch (_) {}
}

async function loadFeed(reset = false) {
  if (reset) {
    feedBlogs.value = []
    feedCursor.value = { lastId: Date.now(), offset: 0 }
    feedEnd.value = false
  }
  if (feedEnd.value) return
  try {
    const res = await blogApi.follow({ lastId: feedCursor.value.lastId, offset: feedCursor.value.offset })
    const d = res.data
    if (!d || !d.list || d.list.length === 0) feedEnd.value = true
    else {
      feedBlogs.value = feedBlogs.value.concat(d.list)
      feedCursor.value = { lastId: d.minTime, offset: d.offset }
    }
  } catch (_) {}
}

async function loadSignCount() {
  try {
    const res = await userApi.signCount()
    signedCount.value = res.data || 0
  } catch (_) {}
}

async function doSign() {
  if (signing.value || signedToday.value) return
  signing.value = true
  try {
    await userApi.sign()
    signedToday.value = true
    sessionStorage.setItem(signKey(), '1')
    window.$message?.success('签到成功 ✨')
    loadSignCount()
  } catch (_) {
  } finally {
    signing.value = false
  }
}

function onTabChange(k) {
  activeTab.value = k
  if (k === '2' && feedBlogs.value.length === 0) loadFeed()
}


function toEdit() { router.push('/profile/edit') }
async function doLogout() {
  await auth.logout()
  window.$message?.info('已退出登录')
  router.push('/home')
}

const level = computed(() => info.value?.level ?? 0)
const credits = computed(() => info.value?.credits ?? 0)
const fans = computed(() => info.value?.fans ?? 0)
const followee = computed(() => info.value?.followee ?? 0)
const city = computed(() => info.value?.city || '未设置')
const introduce = computed(() => info.value?.introduce || '添加个人简介，让大家更好地认识你')

watch(
  () => auth.user?.id,
  (id) => { if (id) { loadInfo(); loadBlogs(); readSignedFromSession() } },
  { immediate: true }
)
onMounted(loadSignCount)
</script>

<template>
  <div class="profile">
    <section class="card">
      <div class="card__top">
        <VAvatar :src="auth.avatar" :size="72" />
        <div class="card__meta">
          <h1 class="card__name serif">{{ auth.nickName || '旅人' }}</h1>
          <p class="muted text-sm">{{ introduce }}</p>
          <div class="card__chips">
            <span class="chip">📍 {{ city }}</span>
            <span class="chip">Lv.{{ level }}</span>
            <span class="chip">积分 {{ credits }}</span>
          </div>
        </div>
        <div class="card__actions">
          <VButton variant="outline" size="sm" @click="toEdit">编辑资料</VButton>
          <VButton variant="ghost" size="sm" @click="doLogout">退出登录</VButton>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat__num">{{ myBlogs.length }}</div>
          <div class="stat__label subtle">笔记</div>
        </div>
        <div class="stat">
          <div class="stat__num">{{ fans }}</div>
          <div class="stat__label subtle">粉丝</div>
        </div>
        <div class="stat">
          <div class="stat__num">{{ followee }}</div>
          <div class="stat__label subtle">关注</div>
        </div>
        <div class="stat stat--sign">
          <div class="stat__num">{{ signedCount }}</div>
          <div class="stat__label subtle">连续签到</div>
          <VButton
            size="sm"
            :variant="signedToday ? 'subtle' : 'primary'"
            :disabled="signedToday"
            :loading="signing"
            @click="doSign"
          >
            {{ signedToday ? '今日已签' : '立即签到' }}
          </VButton>
        </div>
      </div>
    </section>

    <VTabs v-model="activeTab" :items="tabs" @change="onTabChange" />

    <div v-show="activeTab === '1'" class="tab-panel">
      <div v-if="myBlogs.length" class="blog-grid">
        <BlogCard v-for="b in myBlogs" :key="b.id" :blog="b" />
      </div>
      <div v-else class="empty muted">还没有笔记～去<RouterLink to="/publish" class="accent-link">写一篇</RouterLink>吧</div>
    </div>

    <div v-show="activeTab === '2'" class="tab-panel">
      <div v-if="feedBlogs.length" class="blog-grid">
        <BlogCard v-for="b in feedBlogs" :key="b.id" :blog="b" />
      </div>
      <div v-else class="empty muted">关注的人还没更新哦～</div>
      <div v-if="feedBlogs.length && !feedEnd" class="foot">
        <button class="load-more" @click="loadFeed()">加载更多</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile { display: flex; flex-direction: column; gap: var(--space-5); }

.card {
  background: linear-gradient(135deg, #f5efe0 0%, var(--bg-elevated) 60%);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
.card__top {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-4);
  align-items: center;
}
.card__meta { min-width: 0; }
.card__name { font-size: var(--text-2xl); margin-bottom: 2px; }
.card__chips { display: flex; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-3); }
.chip {
  padding: 3px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--fg-muted);
}
.card__actions { display: flex; flex-direction: column; gap: var(--space-2); }

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}
.stat__num { font-size: var(--text-2xl); font-family: var(--font-serif); font-weight: 500; }
.stat__label { font-size: var(--text-xs); }
.stat--sign { gap: var(--space-2); }

.tab-panel { min-height: 200px; }
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}
.empty { padding: var(--space-7); text-align: center; border: 1px dashed var(--border); border-radius: var(--radius-md); }
.accent-link { color: var(--accent); font-weight: 500; }
.accent-link:hover { text-decoration: underline; }

.foot { display: flex; justify-content: center; margin-top: var(--space-4); }
.load-more {
  padding: 10px 24px;
  border-radius: var(--radius-pill);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
}

@media (max-width: 640px) {
  .card__top { grid-template-columns: auto 1fr; }
  .card__actions { grid-column: span 2; flex-direction: row; justify-content: flex-end; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
