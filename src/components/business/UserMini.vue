<script setup>
import { useRouter } from 'vue-router'
import VAvatar from '@/components/ui/VAvatar.vue'

const props = defineProps({
  user: { type: Object, required: true },
  size: { type: Number, default: 32 }
})
const router = useRouter()

function go() {
  if (props.user.id) router.push(`/user/${props.user.id}`)
}
</script>

<template>
  <button class="user-mini" @click="go">
    <VAvatar :src="user.icon" :size="size" />
    <span class="user-mini__name truncate">{{ user.nickName || '匿名' }}</span>
  </button>
</template>

<style scoped>
.user-mini {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 4px 10px 4px 4px;
  border-radius: var(--radius-pill);
  background: var(--bg-sunk);
  color: var(--fg);
  transition: background var(--dur) var(--ease);
  max-width: 100%;
}
.user-mini:hover { background: var(--border); }
.user-mini__name { font-size: var(--text-sm); max-width: 160px; }
</style>
