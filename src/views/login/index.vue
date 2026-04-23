<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'
import VTabs from '@/components/ui/VTabs.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const mode = ref('code') // 'code' | 'password'
const phone = ref('')
const code = ref('')
const password = ref('')
const agreed = ref(false)

const sending = ref(false)
const countdown = ref(0)
const submitting = ref(false)

let timer = null

async function sendCode() {
  if (!phone.value) {
    window.$message?.error('请先输入手机号')
    return
  }
  if (!/^1\d{10}$/.test(phone.value)) {
    window.$message?.error('手机号格式不对')
    return
  }
  sending.value = true
  try {
    await auth.sendCode(phone.value)
    window.$message?.success('验证码已发送')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (_) {
  } finally {
    sending.value = false
  }
}

async function submit() {
  if (!agreed.value) {
    window.$message?.info('请先阅读并同意用户协议')
    return
  }
  if (!phone.value) {
    window.$message?.error('请输入手机号')
    return
  }
  submitting.value = true
  try {
    if (mode.value === 'code') {
      if (!code.value) {
        window.$message?.error('请输入验证码')
        return
      }
      await auth.loginByCode({ phone: phone.value, code: code.value })
    } else {
      if (!password.value) {
        window.$message?.error('请输入密码')
        return
      }
      await auth.loginByPassword({ phone: phone.value, password: password.value })
    }
    window.$message?.success('登录成功')
    const redirect = route.query.redirect || '/home'
    router.replace(redirect)
  } catch (_) {
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="bg" />
    <div class="panel">
      <RouterLink to="/home" class="brand">
        <div class="brand__logo">旅</div>
        <span class="serif">旅无忧</span>
      </RouterLink>

      <div class="card">
        <h1 class="card__title serif">欢迎回来</h1>
        <p class="muted text-sm">登录后即可分享你的旅途故事</p>

        <VTabs
          class="tabs"
          v-model="mode"
          :items="[{ key: 'code', label: '验证码登录' }, { key: 'password', label: '密码登录' }]"
        />

        <form class="form" @submit.prevent="submit">
          <div class="field">
            <label>手机号</label>
            <VInput v-model="phone" placeholder="11 位手机号" size="lg" />
          </div>

          <div v-if="mode === 'code'" class="field field--code">
            <label>验证码</label>
            <div class="code-row">
              <VInput v-model="code" placeholder="6 位验证码" size="lg" />
              <VButton
                variant="outline"
                size="lg"
                :disabled="countdown > 0 || sending"
                :loading="sending"
                type="button"
                @click="sendCode"
              >
                {{ countdown > 0 ? `${countdown}s 后重发` : '发送验证码' }}
              </VButton>
            </div>
          </div>

          <div v-else class="field">
            <label>密码</label>
            <VInput v-model="password" type="password" placeholder="请输入密码" size="lg" />
          </div>

          <label class="agree">
            <input v-model="agreed" type="checkbox" />
            <span>我已阅读并同意<a href="#" class="accent-link">《用户协议》</a>和<a href="#" class="accent-link">《隐私政策》</a></span>
          </label>

          <VButton block size="lg" :loading="submitting" type="submit">登录</VButton>
        </form>

        <div class="foot subtle text-xs">
          未注册的手机号将自动创建账号
        </div>
      </div>

      <RouterLink to="/home" class="back">← 返回首页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  background: var(--bg);
}
.bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 600px 400px at 20% 20%, rgba(201, 100, 66, 0.08), transparent 60%),
    radial-gradient(ellipse 500px 400px at 80% 80%, rgba(92, 123, 154, 0.06), transparent 60%);
  pointer-events: none;
}

.panel {
  position: relative;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: center;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--fg);
  font-size: var(--text-lg);
}
.brand__logo {
  width: 32px; height: 32px;
  background: var(--accent);
  color: var(--fg-on-accent);
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-serif);
}

.card {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.card__title { font-size: var(--text-2xl); margin-bottom: 2px; }

.tabs { margin-top: var(--space-2); }

.form { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-2); }
.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field label { font-size: var(--text-sm); color: var(--fg-muted); }
.code-row { display: flex; gap: var(--space-2); }
.code-row :deep(.v-input) { flex: 1; }

.agree {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  cursor: pointer;
  padding: var(--space-1) 0;
}
.agree input { margin-top: 2px; accent-color: var(--accent); }
.accent-link { color: var(--accent); }
.accent-link:hover { text-decoration: underline; }

.foot { text-align: center; }

.back { color: var(--fg-muted); font-size: var(--text-sm); }
.back:hover { color: var(--accent); }
</style>
