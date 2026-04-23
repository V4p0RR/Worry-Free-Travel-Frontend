import { createRouter, createWebHistory } from 'vue-router'
import { createRoutesGenerator } from '@/utils/generators/routerGenerator.js'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth'

const pages = import.meta.glob('../views/**/page.js', { eager: true, import: 'default' })
const components = import.meta.glob('../views/**/index.vue')

const generateRoutes = createRoutesGenerator({
  pages,
  components,
  basePath: '../views'
})

const generated = generateRoutes({
  layoutComponents: { default: DefaultLayout }
})

// 默认布局挂在 "/"，注入一个空路径子路由将根地址重定向到 /home
const defaultLayout = generated.find((r) => r.path === '/' && Array.isArray(r.children))
if (defaultLayout) {
  defaultLayout.children.unshift({ path: '', redirect: '/home' })
}

const customRoutes = [
  { path: '/:pathMatch(.*)*', redirect: '/notfound' }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...generated, ...customRoutes],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta?.requiresAuth && !auth.isLoggedIn) {
    window.$message?.info('请先登录')
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  next()
})

router.afterEach((to) => {
  const base = '旅无忧'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})

export default router
