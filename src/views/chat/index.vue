<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import VButton from '@/components/ui/VButton.vue'
import { resolveImg, splitImages, formatPrice } from '@/utils/format'

const router = useRouter()
const store = useChatStore()

const input = ref('')
const rateLimited = ref(false)
const bodyRef = ref(null)

const suggestions = [
  '周末想吃川菜，人均100左右，环境好适合约会',
  '推荐几个评分高的火锅店',
  '有什么氛围好的小酒馆推荐',
  '有没有性价比高的日料推荐'
]

function scrollToBottom() {
  nextTick(() => {
    if (bodyRef.value) {
      bodyRef.value.scrollTop = bodyRef.value.scrollHeight
    }
  })
}

onMounted(() => scrollToBottom())

async function send() {
  const q = input.value.trim()
  if (!q || store.loading || rateLimited.value) return
  input.value = ''

  try {
    await store.sendMessage(q)
  } catch (e) {
    if (e.message && e.message.includes('频繁')) {
      rateLimited.value = true
      setTimeout(() => { rateLimited.value = false }, 5000)
    }
  } finally {
    scrollToBottom()
  }
}

function useSuggestion(s) {
  input.value = s
  send()
}

function goTo(link) {
  if (link) router.push(link)
}

watch(() => store.messages.length, () => scrollToBottom())
</script>

<template>
  <div class="chat">
    <div class="chat__body" ref="bodyRef">
      <template v-for="(msg, i) in store.messages" :key="i">
        <!-- AI 消息 -->
        <div v-if="msg.role === 'ai'" class="msg msg--ai">
          <div class="msg__avatar">旅</div>
          <div class="msg__card">
            <div class="msg__text">{{ msg.summary }}</div>

            <div v-if="msg.intention" class="msg__intent">
              <span class="intent-badge">{{ msg.intention }}</span>
            </div>

            <!-- 匹配标签 -->
            <div v-if="msg.tags && msg.tags.length" class="msg__tags">
              <span v-for="t in msg.tags" :key="t.id" class="tag-chip">{{ t.name }}</span>
            </div>

            <!-- 推荐店铺 -->
            <div v-if="msg.shops && msg.shops.length" class="msg__section">
              <div class="msg__section-title">推荐店铺</div>
              <div class="shop-mini-list">
                <button
                  v-for="s in msg.shops" :key="s.id"
                  class="shop-mini"
                  @click="goTo(s.link)"
                >
                  <div class="shop-mini__img">
                    <img
                      v-if="s.images"
                      :src="resolveImg(splitImages(s.images)[0])" alt=""
                      @error="(e) => e.target.style.display='none'"
                    />
                  </div>
                  <div class="shop-mini__info">
                    <div class="shop-mini__name">{{ s.name }}</div>
                    <div class="shop-mini__meta">
                      <span v-if="s.score" class="shop-mini__score">⭐ {{ (s.score / 10).toFixed(1) }}</span>
                      <span v-if="s.avgPrice">人均 ¥{{ formatPrice(s.avgPrice * 100) }}</span>
                      <span>{{ s.area }}</span>
                    </div>
                  </div>
                  <span class="card-link">前往 <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>
                </button>
              </div>
            </div>

            <!-- 推荐笔记 -->
            <div v-if="msg.blogs && msg.blogs.length" class="msg__section">
              <div class="msg__section-title">相关笔记</div>
              <div class="blog-mini-list">
                <button
                  v-for="b in msg.blogs" :key="b.id"
                  class="blog-mini"
                  @click="goTo(b.link)"
                >
                  <div class="blog-mini__img">
                    <img
                      v-if="b.images"
                      :src="resolveImg(splitImages(b.images)[0])" alt=""
                      @error="(e) => e.target.style.display='none'"
                    />
                  </div>
                  <div class="blog-mini__info">
                    <div class="blog-mini__title line-clamp-2">{{ b.title }}</div>
                    <div class="blog-mini__meta">
                      <span v-if="b.liked">❤ {{ b.liked }}</span>
                    </div>
                  </div>
                  <span class="card-link">阅读 <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="msg msg--user">
          <div class="msg__bubble">{{ msg.text }}</div>
        </div>
      </template>

      <!-- 加载中 -->
      <div v-if="store.loading" class="msg msg--ai">
        <div class="msg__avatar">旅</div>
        <div class="msg__card">
          <div class="typing">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <footer class="chat__foot">
      <div v-if="store.messages.length === 1" class="chat__hints">
        <span class="muted text-xs">试试这些：</span>
        <button
          v-for="(s, i) in suggestions" :key="i"
          class="hint-chip"
          @click="useSuggestion(s)"
        >{{ s }}</button>
      </div>
      <div class="chat__input-row">
        <textarea
          v-model="input"
          class="chat__input"
          placeholder="输入你的需求，比如「推荐人均80的火锅」…"
          rows="1"
          @keydown.enter.exact.prevent="send"
          @input="(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }"
        />
        <VButton
          :loading="store.loading"
          :disabled="rateLimited || !input.trim()"
          @click="send"
        >
          发送
        </VButton>
      </div>
      <div v-if="rateLimited" class="chat__rate-hint muted text-xs">请求过于频繁，请 3~5 秒后再试</div>
    </footer>
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--topbar-h) - var(--space-6) * 2);
  max-width: 720px;
  margin: 0 auto;
}
.chat__body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-2);
}

/* 消息气泡 */
.msg { display: flex; gap: var(--space-3); }
.msg--ai { align-items: flex-start; }
.msg--user { justify-content: flex-end; }

.msg__avatar {
  width: 34px; height: 34px;
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--fg-on-accent);
  font-family: var(--font-serif);
  font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.msg__card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
}
.msg__text { font-size: var(--text-base); line-height: 1.6; white-space: pre-line; }
.msg__bubble {
  background: var(--accent-soft);
  color: var(--fg);
  padding: 10px 16px;
  border-radius: var(--radius);
  max-width: 80%;
  font-size: var(--text-base);
  line-height: 1.5;
}

/* 意图标签 */
.msg__intent { display: flex; }
.intent-badge {
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  background: var(--accent-soft);
  color: var(--accent);
  font-size: var(--text-xs);
  font-weight: 500;
}

/* 匹配标签 */
.msg__tags { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.tag-chip {
  padding: 3px 10px;
  background: var(--bg-sunk);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--fg-muted);
}

/* 推荐区块 */
.msg__section { display: flex; flex-direction: column; gap: var(--space-2); }
.msg__section-title {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--fg-muted);
}

/* 跳转链接通用 */
.card-link {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 2px;
  font-size: var(--text-xs);
  color: var(--accent);
  font-weight: 500;
}

/* 店铺/笔记迷你卡片 */
.shop-mini-list,
.blog-mini-list {
  display: flex; flex-direction: column; gap: var(--space-2);
}
.shop-mini,
.blog-mini {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2);
  border-radius: var(--radius);
  background: var(--bg-sunk);
  text-align: left;
  transition: background var(--dur) var(--ease);
  color: var(--fg);
  width: 100%;
}
.shop-mini:hover,
.blog-mini:hover {
  background: var(--border);
}
.shop-mini__img,
.blog-mini__img {
  width: 48px; height: 48px;
  border-radius: var(--radius-sm);
  background: var(--bg);
  overflow: hidden;
  flex-shrink: 0;
}
.shop-mini__img img,
.blog-mini__img img {
  width: 100%; height: 100%; object-fit: cover;
}
.shop-mini__info,
.blog-mini__info {
  flex: 1; min-width: 0;
}
.shop-mini__name,
.blog-mini__title {
  font-size: var(--text-sm); font-weight: 500;
}
.shop-mini__meta,
.blog-mini__meta {
  display: flex; gap: var(--space-3); font-size: var(--text-xs); color: var(--fg-muted);
}
.shop-mini__name { margin-bottom: 2px; }
.blog-mini__title { margin-bottom: 2px; }
.shop-mini__score { color: var(--accent); }

/* 加载动画 */
.typing { display: flex; gap: 4px; padding: 4px 0; }
.typing span {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--fg-subtle);
  animation: typing 1.2s infinite ease-in-out;
}
.typing span:nth-child(2) { animation-delay: 0.15s; }
.typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
  30% { opacity: 1; transform: scale(1); }
}

/* 输入区 */
.chat__foot {
  border-top: 1px solid var(--border);
  padding: var(--space-3) 0 0;
  background: var(--bg);
}
.chat__hints {
  display: flex; gap: var(--space-2); flex-wrap: wrap; align-items: center;
  margin-bottom: var(--space-2);
}
.hint-chip {
  padding: 3px 10px;
  background: var(--bg-sunk);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
  color: var(--fg-muted);
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.hint-chip:hover { border-color: var(--border-strong); color: var(--fg); }
.chat__input-row {
  display: flex; gap: var(--space-3); align-items: flex-end;
}
.chat__input {
  flex: 1;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: var(--text-base);
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  transition: border-color var(--dur) var(--ease);
}
.chat__input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }
.chat__rate-hint { margin-top: var(--space-1); }

@media (max-width: 600px) {
  .card-link { font-size: 10px; }
}
</style>
