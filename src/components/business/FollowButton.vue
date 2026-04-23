<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as followApi from '@/api/follow'
import { useAuthStore } from '@/stores/auth'
import VButton from '@/components/ui/VButton.vue'

const props = defineProps({
  userId: { type: [Number, String], required: true }
})

const auth = useAuthStore()
const router = useRouter()
const followed = ref(false)
const loading = ref(false)

const hide = computed(() => auth.user && String(auth.user.id) === String(props.userId))

async function refresh() {
  if (!auth.isLoggedIn || !props.userId || hide.value) return
  try {
    const res = await followApi.isFollowed(props.userId)
    followed.value = !!res.data
  } catch (_) {}
}

async function toggle() {
  if (!auth.isLoggedIn) {
    window.$message?.info('请先登录')
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  loading.value = true
  try {
    await followApi.toggle(props.userId, !followed.value)
    followed.value = !followed.value
    window.$message?.success(followed.value ? '已关注' : '已取消关注')
  } catch (_) {
  } finally {
    loading.value = false
  }
}

watch(() => [props.userId, auth.isLoggedIn], refresh, { immediate: true })
</script>

<template>
  <VButton
    v-if="!hide"
    :variant="followed ? 'outline' : 'primary'"
    size="sm"
    :loading="loading"
    @click="toggle"
  >
    {{ followed ? '已关注' : '关注' }}
  </VButton>
</template>
