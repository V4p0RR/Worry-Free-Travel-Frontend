<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VAvatar from '@/components/ui/VAvatar.vue'
import VButton from '@/components/ui/VButton.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const nav = [
  { to: '/home', label: '首页', icon: 'M3 12L12 4l9 8M5 10v10h14V10' },
  { to: '/shops', label: '店铺', icon: 'M4 7h16l-1 13H5zM9 7V5a3 3 0 0 1 6 0v2' },
  { to: '/blogs', label: '笔记', icon: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5' },
  { to: '/feed', label: '关注', icon: 'M12 21s-8-5-8-12a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7-8 12-8 12z' },
  { to: '/publish', label: '发笔记', icon: 'M12 5v14M5 12h14', accent: true }
]

const menuOpen = ref(false)
const menuEl = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function doLogout() {
  menuOpen.value = false
  auth.logout()
  window.$message?.info('已退出登录')
  router.push('/home')
}

function onClickOutside(e) {
  if (menuEl.value && !menuEl.value.contains(e.target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  if (auth.token && !auth.user) auth.fetchMe()
})

const pageTitle = computed(() => route.meta?.title || '')

// 判断当前页面是否是顶级页面（不需要返回键）
const topLevelRoutes = ['/home', '/shops', '/blogs', '/feed', '/publish', '/profile']
const canGoBack = computed(() => !topLevelRoutes.includes(route.path))

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand__logo">旅</div>
        <div class="brand__text">
          <span class="serif brand__name">旅无忧</span>
          <span class="brand__tag subtle text-xs">Explore · Share</span>
        </div>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="n in nav"
          :key="n.to"
          :to="n.to"
          class="nav__item"
          :class="{ 'nav__item--accent': n.accent }"
          active-class="nav__item--active"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path :d="n.icon" />
          </svg>
          <span>{{ n.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar__spacer" />

      <div class="user-cell" ref="menuEl">
        <template v-if="auth.isLoggedIn">
          <button class="user-cell__trigger" @click="toggleMenu">
            <VAvatar :src="auth.avatar" :size="34" />
            <div class="user-cell__meta">
              <div class="user-cell__name truncate">{{ auth.nickName || '旅人' }}</div>
              <div class="user-cell__sub subtle text-xs">个人中心</div>
            </div>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </button>
          <Transition name="menu">
            <div v-if="menuOpen" class="menu">
              <RouterLink to="/profile" class="menu__item" @click="menuOpen = false">
                我的主页
              </RouterLink>
              <RouterLink to="/profile/edit" class="menu__item" @click="menuOpen = false">
                编辑资料
              </RouterLink>
              <div class="menu__divider" />
              <button class="menu__item menu__item--danger" @click="doLogout">退出登录</button>
            </div>
          </Transition>
        </template>
        <VButton v-else variant="outline" block @click="router.push({ path: '/login', query: { redirect: route.fullPath } })">
          登录 / 注册
        </VButton>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="topbar__left">
          <button v-if="canGoBack" class="topbar__back" @click="goBack" aria-label="返回">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div class="topbar__crumb">
            <span class="muted text-sm">{{ pageTitle }}</span>
          </div>
        </div>
        <RouterLink to="/shops" class="topbar__search">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span class="muted text-sm">搜索店铺…</span>
        </RouterLink>
      </header>
      <div class="page">
        <RouterView />
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="mob-tab">
      <RouterLink
        v-for="n in nav"
        :key="n.to"
        :to="n.to"
        class="mob-tab__item"
        :class="{ 'mob-tab__item--accent': n.accent }"
        active-class="mob-tab__item--active"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path :d="n.icon" />
        </svg>
        <span>{{ n.label }}</span>
      </RouterLink>
      <!-- 我的：登录跳主页，未登录跳登录页 -->
      <RouterLink
        :to="auth.isLoggedIn ? '/profile' : '/login'"
        class="mob-tab__item"
        active-class="mob-tab__item--active"
      >
        <VAvatar v-if="auth.isLoggedIn" :src="auth.avatar" :size="22" />
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        <span>{{ auth.isLoggedIn ? '我的' : '登录' }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  padding: var(--space-5) var(--space-3);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: sticky;
  top: 0;
  height: 100vh;
}
.sidebar__spacer { flex: 1; }

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
}
.brand__logo {
  width: 36px; height: 36px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--fg-on-accent);
  font-family: var(--font-serif);
  font-size: 20px;
  display: flex; align-items: center; justify-content: center;
}
.brand__text { display: flex; flex-direction: column; line-height: 1.2; }
.brand__name { font-size: var(--text-lg); font-weight: 500; }

.nav { display: flex; flex-direction: column; gap: 2px; margin-top: var(--space-3); }
.nav__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 9px var(--space-3);
  border-radius: var(--radius);
  color: var(--fg-muted);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
  font-size: var(--text-base);
}
.nav__item:hover { background: var(--bg-sunk); color: var(--fg); }
.nav__item--active { background: var(--bg-sunk); color: var(--fg); font-weight: 500; }
.nav__item--accent {
  margin-top: var(--space-2);
  color: var(--accent);
  border: 1px dashed rgba(201, 100, 66, 0.35);
}
.nav__item--accent:hover { background: var(--accent-soft); color: var(--accent); }
.nav__item--accent.nav__item--active { background: var(--accent-soft); color: var(--accent); }

.user-cell {
  position: relative;
  padding: var(--space-2);
  border-top: 1px solid var(--border);
}
.user-cell__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  border-radius: var(--radius);
  transition: background var(--dur) var(--ease);
  color: var(--fg);
}
.user-cell__trigger:hover { background: var(--bg-sunk); }
.user-cell__meta { flex: 1; min-width: 0; text-align: left; }
.user-cell__name { font-size: var(--text-sm); font-weight: 500; }

.menu {
  position: absolute;
  bottom: calc(100% + 4px);
  left: var(--space-2); right: var(--space-2);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: var(--space-1);
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.menu__item {
  display: block;
  padding: 8px var(--space-3);
  border-radius: var(--radius-sm);
  text-align: left;
  color: var(--fg);
  font-size: var(--text-sm);
  transition: background var(--dur) var(--ease);
  width: 100%;
}
.menu__item:hover { background: var(--bg-sunk); }
.menu__item--danger { color: var(--danger); }
.menu__divider { height: 1px; background: var(--border); margin: var(--space-1) 0; }

.menu-enter-active, .menu-leave-active { transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease); }
.menu-enter-from, .menu-leave-to { opacity: 0; transform: translateY(4px); }

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--topbar-h);
  padding: 0 var(--space-6);
  border-bottom: 1px solid var(--border);
  background: rgba(250, 249, 245, 0.85);
  backdrop-filter: blur(12px);
}
.topbar__search {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 14px;
  background: var(--bg-sunk);
  border-radius: var(--radius-pill);
  border: 1px solid transparent;
  transition: border-color var(--dur) var(--ease);
}
.topbar__search:hover { border-color: var(--border-strong); }

.page {
  flex: 1;
  padding: var(--space-6);
  max-width: var(--max-content-w);
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .sidebar { width: 72px; }
  .brand__text, .user-cell__meta, .user-cell__trigger > svg { display: none; }
  .nav__item > span { display: none; }
  .nav__item { justify-content: center; }
  .user-cell__trigger { justify-content: center; }
}

@media (max-width: 600px) {
  .sidebar { display: none; }
}

/* 移动端顶部返回按钮 */
.topbar__left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.topbar__back {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  color: var(--fg);
  transition: background var(--dur) var(--ease);
}
.topbar__back:hover { background: var(--bg-sunk); }
@media (max-width: 600px) {
  .topbar__back { display: flex; }
}

/* 移动端底部 tab */
.mob-tab {
  display: none;
}
@media (max-width: 600px) {
  .mob-tab {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: rgba(250, 249, 245, 0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    z-index: 100;
  }
  .page { padding-bottom: 64px; }
}
.mob-tab__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--fg-subtle);
  font-size: 10px;
  transition: color var(--dur) var(--ease);
}
.mob-tab__item--active { color: var(--fg); }
.mob-tab__item--accent { color: var(--accent); }
.mob-tab__item--accent.mob-tab__item--active { color: var(--accent); }
</style>
