<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as userApi from '@/api/user'
import VAvatar from '@/components/ui/VAvatar.vue'
import VInput from '@/components/ui/VInput.vue'
import VButton from '@/components/ui/VButton.vue'

const auth = useAuthStore()
const router = useRouter()

const form = ref({
  nickName: '',
  icon: '',
  city: '',
  introduce: '',
  gender: 0,
  birthday: ''
})

async function load() {
  if (!auth.user?.id) return
  form.value.nickName = auth.user.nickName || ''
  form.value.icon = auth.user.icon || ''
  try {
    const res = await userApi.getUserInfo(auth.user.id)
    const d = res.data
    if (d) {
      form.value.city = d.city || ''
      form.value.introduce = d.introduce || ''
      form.value.gender = d.gender ?? 0
      form.value.birthday = d.birthday || ''
    }
  } catch (_) {}
}

function save() {
  window.$message?.info('资料更新接口建设中，暂不支持保存')
}

onMounted(load)
</script>

<template>
  <div class="edit">
    <header class="edit__head">
      <div>
        <h1 class="serif">编辑资料</h1>
        <p class="muted text-sm">让别人更好地认识你</p>
      </div>
      <div class="edit__actions">
        <VButton variant="ghost" @click="router.back()">取消</VButton>
        <VButton @click="save">保存</VButton>
      </div>
    </header>

    <section class="card">
      <div class="row">
        <VAvatar :src="form.icon" :size="72" />
        <div class="col gap-1">
          <div class="text-md serif">头像</div>
          <div class="subtle text-xs">暂不支持在线修改头像</div>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="field">
        <label>昵称</label>
        <VInput v-model="form.nickName" placeholder="给自己起个好听的名字" />
      </div>
      <div class="field">
        <label>个人简介</label>
        <textarea v-model="form.introduce" class="textarea" rows="3" placeholder="介绍一下自己…"></textarea>
      </div>
      <div class="grid">
        <div class="field">
          <label>城市</label>
          <VInput v-model="form.city" placeholder="你在哪座城市" />
        </div>
        <div class="field">
          <label>生日</label>
          <VInput v-model="form.birthday" type="date" placeholder="YYYY-MM-DD" />
        </div>
      </div>
      <div class="field">
        <label>性别</label>
        <div class="segmented">
          <button
            v-for="opt in [{ v: 0, t: '保密' }, { v: 1, t: '男' }, { v: 2, t: '女' }]"
            :key="opt.v"
            class="segmented__item"
            :class="{ 'is-active': form.gender === opt.v }"
            @click="form.gender = opt.v"
          >
            {{ opt.t }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.edit { display: flex; flex-direction: column; gap: var(--space-5); max-width: 640px; margin: 0 auto; width: 100%; }
.edit__head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-3); flex-wrap: wrap; }
.edit__head h1 { font-size: var(--text-3xl); }
.edit__actions { display: flex; gap: var(--space-2); }

.card {
  padding: var(--space-5);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.row { display: flex; align-items: center; gap: var(--space-4); }
.col { display: flex; flex-direction: column; gap: var(--space-1); }

.field { display: flex; flex-direction: column; gap: var(--space-2); }
.field label { font-size: var(--text-sm); color: var(--fg-muted); }
.textarea {
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-3);
  font-size: var(--text-base);
  line-height: 1.6;
  font: inherit;
}
.textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-ring); }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }

.segmented {
  display: inline-flex;
  padding: 3px;
  background: var(--bg-sunk);
  border-radius: var(--radius-pill);
  border: 1px solid var(--border);
}
.segmented__item {
  padding: 6px 18px;
  border-radius: var(--radius-pill);
  color: var(--fg-muted);
  font-size: var(--text-sm);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.segmented__item.is-active { background: var(--bg-elevated); color: var(--fg); box-shadow: var(--shadow-xs); }
</style>
