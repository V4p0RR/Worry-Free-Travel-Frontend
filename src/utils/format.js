export function formatPrice(fen) {
  if (fen == null || isNaN(fen)) return '0.00'
  return (Number(fen) / 100).toFixed(2)
}

export function formatDistance(m) {
  if (!m && m !== 0) return ''
  return m < 1000 ? `${m.toFixed(0)}m` : `${(m / 1000).toFixed(1)}km`
}

export function formatDiscount(payValue, actualValue) {
  if (!payValue || !actualValue) return ''
  return `${((payValue * 10) / actualValue).toFixed(1)}折`
}

export function formatTimeRange(begin, end) {
  try {
    const b = new Date(begin)
    const e = new Date(end)
    const pad = (n) => String(n).padStart(2, '0')
    const date = `${b.getMonth() + 1}月${b.getDate()}日`
    return `${date} ${pad(b.getHours())}:${pad(b.getMinutes())} ~ ${pad(e.getHours())}:${pad(e.getMinutes())}`
  } catch (_) {
    return ''
  }
}

export function formatRelativeDate(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const now = new Date()
  const diff = now - d
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}天前`
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 归一化后端返回的图片路径。
 * 后端沿用老 nginx 的 `/imgs/...` 前缀，而新前端把静态资源直接挂在 public 根下
 * （`/icons/...` `/blogs/...` `/types/...`），所以统一剥掉 `/imgs` 前缀。
 * 纯文件名时可带一个 fallbackDir 兜底。
 */
export function resolveImg(src, fallbackDir = '') {
  if (!src) return ''
  const s = String(src).trim()
  if (!s) return ''
  if (/^(https?:|data:|blob:)/i.test(s)) return s
  if (s.startsWith('/imgs/')) return s.slice(5)
  if (s.startsWith('imgs/')) return '/' + s.slice(5)
  if (s.startsWith('/')) return s
  return fallbackDir ? `${fallbackDir.replace(/\/$/, '')}/${s}` : `/${s}`
}

export function splitImages(images) {
  if (!images) return []
  const arr = Array.isArray(images)
    ? images
    : images.split(',').map((s) => s.trim()).filter(Boolean)
  return arr.map((s) => resolveImg(s))
}
