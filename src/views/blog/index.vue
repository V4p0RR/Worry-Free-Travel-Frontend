<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as blogApi from '@/api/blog'
import * as shopApi from '@/api/shop'
import VAvatar from '@/components/ui/VAvatar.vue'
import VRate from '@/components/ui/VRate.vue'
import FollowButton from '@/components/business/FollowButton.vue'
import LikeButton from '@/components/business/LikeButton.vue'
import UserMini from '@/components/business/UserMini.vue'
import { splitImages, formatRelativeDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const blog = ref(null)
const images = ref([])
const activeImg = ref(0)
const shop = ref(null)
const likeRank = ref([])

async function loadBlog(id) {
  try {
    const res = await blogApi.getById(id)
    blog.value = res.data
    images.value = splitImages(res.data.images)
    activeImg.value = 0
    if (res.data?.shopId) loadShop(res.data.shopId)
    loadLikeRank(id)
  } catch (_) {}
}
async function loadShop(id) {
  try {
    const res = await shopApi.getShop(id)
    shop.value = res.data
  } catch (_) {}
}
async function loadLikeRank(id) {
  try {
    const res = await blogApi.likeRank(id)
    likeRank.value = res.data || []
  } catch (_) {}
}

function onLikeChange() {
  loadLikeRank(blog.value.id)
}
function updateLiked(v) { blog.value.isLike = v }
function updateCount(v) { blog.value.liked = v }

const shopCover = computed(() => splitImages(shop.value?.images)[0] || '')
const shopScore = computed(() => (shop.value?.score ? shop.value.score / 10 : 0))

watch(() => route.params.id, (id) => { if (id) loadBlog(id) }, { immediate: true })
</script>

<template>
  <article v-if="blog" class="blog-detail">
    <div v-if="images.length" class="swiper">
      <div class="swiper__main">
        <img :src="images[activeImg]" :alt="blog.title" />
      </div>
      <div v-if="images.length > 1" class="swiper__thumbs">
        <button
          v-for="(img, i) in images"
          :key="i"
          class="swiper__thumb"
          :class="{ 'is-active': i === activeImg }"
          @click="activeImg = i"
        >
          <img :src="img" alt="" />
        </button>
      </div>
    </div>

    <header class="author-row">
      <button class="author" @click="blog.userId && router.push(`/user/${blog.userId}`)">
        <VAvatar :src="blog.icon" :size="44" />
        <span class="author__meta">
          <span class="author__name">{{ blog.name || '匿名' }}</span>
          <span class="author__time subtle text-xs">{{ formatRelativeDate(blog.createTime) }}</span>
        </span>
      </button>
      <FollowButton v-if="blog.userId" :user-id="blog.userId" />
    </header>

    <h1 class="blog-detail__title serif">{{ blog.title || '未命名' }}</h1>

    <div v-if="blog.content" class="blog-detail__content">
      {{ blog.content }}
    </div>

    <section v-if="shop" class="shop-card" @click="router.push(`/shop/${shop.id}`)">
      <div class="shop-card__cover">
        <img v-if="shopCover" :src="shopCover" :alt="shop.name" />
      </div>
      <div class="shop-card__body">
        <div class="shop-card__name">{{ shop.name }}</div>
        <VRate :value="shopScore" show-score :size="13" />
        <div class="subtle text-xs">￥{{ shop.avgPrice }}/人</div>
      </div>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </section>

    <footer class="actions">
      <LikeButton
        :blog-id="blog.id"
        :liked="!!blog.isLike"
        :count="blog.liked || 0"
        @change="onLikeChange"
        @update:liked="updateLiked"
        @update:count="updateCount"
      />
      <div v-if="likeRank.length" class="rank">
        <span class="subtle text-xs">最近点赞</span>
        <UserMini v-for="u in likeRank" :key="u.id" :user="u" :size="22" />
      </div>
    </footer>

    <section class="comments-placeholder muted text-sm">
      评论功能建设中，感谢你的耐心～
    </section>
  </article>
  <div v-else class="loading muted">正在加载笔记…</div>
</template>

<style scoped>
.blog-detail {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.loading { text-align: center; padding: var(--space-7); }

.swiper { display: flex; flex-direction: column; gap: var(--space-2); }
.swiper__main {
  aspect-ratio: 4/3;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-sunk);
}
.swiper__main img { width: 100%; height: 100%; object-fit: cover; animation: fade-in var(--dur) var(--ease); }
.swiper__thumbs { display: flex; gap: var(--space-2); overflow-x: auto; }
.swiper__thumb {
  flex: 0 0 70px;
  height: 70px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  background: var(--bg-sunk);
}
.swiper__thumb img { width: 100%; height: 100%; object-fit: cover; }
.swiper__thumb.is-active { border-color: var(--accent); }

.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.author {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--fg);
}
.author__meta { display: flex; flex-direction: column; text-align: left; }
.author__name { font-size: var(--text-md); font-weight: 500; }

.blog-detail__title { font-size: var(--text-2xl); line-height: 1.35; }
.blog-detail__content {
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--fg);
  white-space: pre-wrap;
}

.shop-card {
  display: grid;
  grid-template-columns: 70px 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}
.shop-card:hover { background: var(--bg-sunk); }
.shop-card__cover {
  width: 70px; height: 70px;
  border-radius: var(--radius);
  background: var(--bg-sunk);
  overflow: hidden;
}
.shop-card__cover img { width: 100%; height: 100%; object-fit: cover; }
.shop-card__body { display: flex; flex-direction: column; gap: 4px; }
.shop-card__name { font-weight: 500; }

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.rank { display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; }

.comments-placeholder {
  padding: var(--space-6);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
  text-align: center;
}
</style>
