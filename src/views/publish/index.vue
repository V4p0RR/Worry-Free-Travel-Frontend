<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as uploadApi from '@/api/upload'
import * as shopApi from '@/api/shop'
import * as blogApi from '@/api/blog'
import VButton from '@/components/ui/VButton.vue'
import VInput from '@/components/ui/VInput.vue'
import VDialog from '@/components/ui/VDialog.vue'
import { resolveImg } from '@/utils/format'

const router = useRouter()

const title = ref('')
const content = ref('')
const selectedShop = ref(null)
const fileList = ref([]) // [{ url, path }]
const uploading = ref(false)
const submitting = ref(false)
const fileInputRef = ref(null)

const dialogOpen = ref(false)
const shopQuery = ref('')
const shops = ref([])
const shopLoading = ref(false)

function openPicker() {
  fileInputRef.value?.click()
}

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadApi.uploadBlogImage(file)
    fileList.value.push({ url: resolveImg(res.data), path: res.data })
    window.$message?.success('上传成功')
  } catch (_) {
  } finally {
    uploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

async function removeImage(i) {
  const item = fileList.value[i]
  try {
    await uploadApi.deleteBlogImage(item.path)
  } catch (_) {}
  fileList.value.splice(i, 1)
}

async function searchShops() {
  shopLoading.value = true
  try {
    const res = await shopApi.searchByName({ name: shopQuery.value || '', current: 1 })
    shops.value = res.data || []
  } catch (_) {
  } finally {
    shopLoading.value = false
  }
}

function openShopPicker() {
  dialogOpen.value = true
  if (!shops.value.length) searchShops()
}

function pickShop(s) {
  selectedShop.value = s
  dialogOpen.value = false
}

async function submit() {
  if (!title.value.trim()) {
    window.$message?.error('请填写标题')
    return
  }
  if (!selectedShop.value) {
    window.$message?.error('请选择关联店铺')
    return
  }
  submitting.value = true
  try {
    await blogApi.publish({
      title: title.value.trim(),
      content: content.value,
      images: fileList.value.map((f) => f.path).join(','),
      shopId: selectedShop.value.id
    })
    window.$message?.success('发布成功')
    router.push('/profile')
  } catch (_) {
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="publish">
    <header class="publish__head">
      <div>
        <h1 class="serif">分享一段经历</h1>
        <p class="muted">写下你推荐的理由，让更多旅人看到</p>
      </div>
      <div class="publish__actions">
        <VButton variant="ghost" @click="router.back()">取消</VButton>
        <VButton :loading="submitting" @click="submit">发布</VButton>
      </div>
    </header>

    <div class="form">
      <section class="uploader">
        <div class="uploader__grid">
          <div v-for="(f, i) in fileList" :key="i" class="uploader__item">
            <img :src="f.url" alt="" />
            <button class="uploader__del" @click="removeImage(i)">×</button>
          </div>
          <button class="uploader__add" :disabled="uploading" @click="openPicker">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span class="text-xs">{{ uploading ? '上传中…' : '添加图片' }}</span>
          </button>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="onFileChange"
        />
      </section>

      <section class="field">
        <label class="field__label">标题</label>
        <VInput v-model="title" placeholder="一句话总结这段经历…" size="lg" />
      </section>

      <section class="field">
        <label class="field__label">正文</label>
        <textarea
          v-model="content"
          class="field__textarea"
          rows="8"
          placeholder="最近打卡了什么地方？有什么新奇体验？"
        ></textarea>
      </section>

      <section class="field">
        <label class="field__label">关联店铺</label>
        <button class="shop-picker" @click="openShopPicker">
          <span v-if="selectedShop">{{ selectedShop.name }} · {{ selectedShop.area }}</span>
          <span v-else class="subtle">从搜索里选一家关联的店铺 →</span>
        </button>
      </section>
    </div>

    <VDialog v-model="dialogOpen" title="选择关联店铺" width="560px">
      <div class="shop-picker-dialog">
        <div class="shop-picker-dialog__search">
          <VInput
            v-model="shopQuery"
            placeholder="搜索店铺名称"
            size="md"
            @enter="searchShops"
          />
          <VButton @click="searchShops">搜索</VButton>
        </div>
        <div class="shop-picker-dialog__list">
          <button
            v-for="s in shops"
            :key="s.id"
            class="shop-picker-dialog__item"
            @click="pickShop(s)"
          >
            <div class="shop-picker-dialog__name">{{ s.name }}</div>
            <div class="subtle text-xs">{{ s.area }}</div>
          </button>
          <div v-if="!shopLoading && shops.length === 0" class="muted text-sm empty">
            没有找到店铺～换个关键词试试
          </div>
        </div>
      </div>
    </VDialog>
  </div>
</template>

<style scoped>
.publish { display: flex; flex-direction: column; gap: var(--space-5); max-width: 760px; margin: 0 auto; width: 100%; }
.publish__head { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.publish__head h1 { font-size: var(--text-3xl); }
.publish__actions { display: flex; gap: var(--space-2); }

.form { display: flex; flex-direction: column; gap: var(--space-5); }

.uploader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-3);
}
.uploader__item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-sunk);
}
.uploader__item img { width: 100%; height: 100%; object-fit: cover; }
.uploader__del {
  position: absolute;
  top: 4px; right: 4px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: rgba(31, 30, 29, 0.7);
  color: var(--bg);
  line-height: 1;
  font-size: 14px;
}
.uploader__add {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  color: var(--fg-muted);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.uploader__add:hover:not(:disabled) { background: var(--bg-sunk); color: var(--fg); }

.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field__label { font-size: var(--text-sm); color: var(--fg-muted); }
.field__textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-3);
  font-size: var(--text-base);
  line-height: 1.6;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.field__textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }

.shop-picker {
  text-align: left;
  padding: var(--space-3);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--fg);
  transition: border-color var(--dur) var(--ease);
}
.shop-picker:hover { border-color: var(--border-strong); }

.shop-picker-dialog { display: flex; flex-direction: column; gap: var(--space-3); }
.shop-picker-dialog__search { display: flex; gap: var(--space-2); }
.shop-picker-dialog__search :deep(.v-input) { flex: 1; }
.shop-picker-dialog__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 360px;
  overflow-y: auto;
}
.shop-picker-dialog__item {
  text-align: left;
  padding: var(--space-3);
  border-radius: var(--radius);
  background: var(--bg-sunk);
  transition: background var(--dur) var(--ease);
}
.shop-picker-dialog__item:hover { background: var(--border); }
.shop-picker-dialog__name { font-weight: 500; margin-bottom: 2px; }
.empty { text-align: center; padding: var(--space-5); }
</style>
