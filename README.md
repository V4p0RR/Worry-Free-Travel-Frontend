# 旅无忧 · 前端

> 发现身边的好去处 —— 本地生活探索与分享平台
>
> # web端适配
<img width="1906" height="937" alt="image" src="https://github.com/user-attachments/assets/54611c6c-2384-4652-ae5d-18ae84f68782" />
# 移动端适配
<img width="388" height="842" alt="image" src="https://github.com/user-attachments/assets/a56e2af4-df08-4201-90f2-3c103b4607d3" />


## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 3 + Vite |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router 4（自动路由生成） |
| 请求 | Axios（统一拦截器） |
| 样式 | CSS Variables 设计令牌 |

## 功能模块

- **首页** — 热门笔记瀑布流 + 店铺分类入口
- **店铺** — 按分类筛选、搜索、详情（优惠券、秒杀）
- **笔记** — 发现页、详情（图片轮播、点赞、评论）
- **关注** — 关注用户的动态 Feed 流
- **发笔记** — 图片上传 + 图文发布
- **个人主页** — 签到、我的笔记、粉丝/关注数
- **登录** — 验证码 / 密码双模式

## 目录结构

```text
src/
├── api/            # 接口层（按业务拆分）
├── components/
│   ├── ui/         # 基础组件（VButton、VInput、VCard 等）
│   ├── business/   # 业务组件（BlogCard、ShopCard 等）
│   └── layout/     # 布局（侧边栏、空白页）
├── stores/         # Pinia 状态（auth）
├── utils/          # request.js、format.js
├── style/          # tokens.css、reset.css、global.css
└── views/          # 页面（自动路由）
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（代理到后端 :8081）
npm run dev

# 生产构建
npm run build
```

后端接口默认代理至 `http://localhost:8081`，可在 [vite.config.js](vite.config.js) 中修改。

## 设计规范

配色基于 Claude.ai 风格：

| 令牌 | 值 | 用途 |
|------|----|------|
| `--bg` | `#faf9f5` | 页面底色 |
| `--fg` | `#1f1e1d` | 主文字 |
| `--accent` | `#c96442` | 强调色、按钮 |

响应式断点：
- `>960px` — 完整侧边栏
- `601–960px` — 图标侧边栏
- `≤600px` — 底部 Tab 导航 + 顶部返回键
