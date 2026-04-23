<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="notfound">
    <div class="notfound__num serif">404</div>
    <h1 class="serif">我们找不到你想要的页面</h1>
    <p class="muted">也许地址被改过，或者它从未存在过。</p>
    <div class="actions">
      <button class="primary" @click="router.push('/home')">返回首页</button>
      <button class="ghost" @click="router.back()">返回上一页</button>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-6);
  text-align: center;
  background: var(--bg);
}
.notfound__num {
  font-size: 120px;
  line-height: 1;
  color: var(--accent);
  letter-spacing: -0.04em;
}
.notfound h1 { font-size: var(--text-2xl); }
.actions { display: flex; gap: var(--space-3); margin-top: var(--space-3); }
.primary {
  padding: 10px 22px;
  background: var(--accent);
  color: var(--fg-on-accent);
  border-radius: var(--radius-pill);
}
.primary:hover { background: var(--accent-hover); }
.ghost {
  padding: 10px 22px;
  border-radius: var(--radius-pill);
  color: var(--fg);
  border: 1px solid var(--border);
}
.ghost:hover { background: var(--bg-sunk); }
</style>
