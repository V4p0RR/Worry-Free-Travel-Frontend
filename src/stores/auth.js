import { defineStore } from 'pinia'
import * as userApi from '@/api/user'
import { resolveImg } from '@/utils/format'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null // { id, nickName, icon }
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    nickName: (state) => state.user?.nickName || '',
    avatar: (state) => resolveImg(state.user?.icon) || '/imgs/icons/default-icon.png'
  },
  actions: {
    async loginByCode({ phone, code }) {
      const res = await userApi.login({ phone, code })
      this.token = res.data
      await this.fetchMe()
    },
    async loginByPassword({ phone, password }) {
      const res = await userApi.login({ phone, password })
      this.token = res.data
      await this.fetchMe()
    },
    async sendCode(phone) {
      await userApi.sendCode(phone)
    },
    async fetchMe() {
      if (!this.token) return
      try {
        const res = await userApi.getMe()
        this.user = res.data
      } catch (e) {
        this.logout(true)
      }
    },
    async logout(silent = false) {
      const had = !!this.token
      this.token = ''
      this.user = null
      if (had && !silent) {
        userApi.logout().catch(() => {})
      }
    }
  },
  persist: {
    pick: ['token']
  }
})
