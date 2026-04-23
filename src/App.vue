<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import VMessage from '@/components/ui/VMessage.vue'

const auth = useAuthStore()
onMounted(() => {
  if (auth.token) auth.fetchMe()
})
</script>

<template>
  <VMessage />
  <RouterView />
</template>
