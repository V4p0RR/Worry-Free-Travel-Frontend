import { defineStore } from 'pinia'
import * as agentApi from '@/api/agent'

export const useChatStore = defineStore('chat', {
  state: () => ({
    loading: false,
    messages: [
      {
        role: 'ai',
        summary: '你好！我是旅无忧的 AI 智能客服 🧳\n\n我可以帮你：\n• 根据口味、预算、场景推荐餐厅\n• 发现热门打卡地\n• 查看探店笔记\n\n直接告诉我你的需求，比如"想吃人均80左右的火锅"～'
      }
    ],
    conversationId: null
  }),
  actions: {
    async sendMessage(query) {
      this.loading = true
      this.messages.push({ role: 'user', text: query })

      const payload = { query }
      if (this.conversationId) payload.conversationId = this.conversationId

      try {
        const res = await agentApi.chat(payload)
        // Agent 返回蛇形命名，统一转驼峰存储
        if (res.conversation_id) this.conversationId = res.conversation_id

        this.messages.push({
          role: 'ai',
          summary: res.summary || '',
          intention: res.intention || '',
          tags: res.matched_tags || [],
          shops: (res.recommended_shops || []).slice(0, 3),
          blogs: (res.recommended_blogs || []).slice(0, 2)
        })
      } catch (e) {
        if (e.message && e.message.includes('频繁')) {
          this.messages.push({ role: 'ai', summary: '你问得太快啦，请稍等几秒再试～' })
        }
        throw e
      } finally {
        this.loading = false
      }
    }
  },
  persist: {
    storage: sessionStorage,
    pick: ['messages', 'conversationId']
  }
})
