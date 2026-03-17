import { getApiBase } from "@/lib/api-base"

const API_BASE = getApiBase()

function withStaticUploadsPath(url: string): string {
  return url.replace("/uploads/", "/static/uploads/")
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return "/placeholder.jpg"

  const trimmed = url.trim()
  if (!trimmed) return "/placeholder.jpg"

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    try {
      const parsed = new URL(trimmed)
      if (parsed.pathname.startsWith("/uploads/")) {
        parsed.pathname = withStaticUploadsPath(parsed.pathname)
        return parsed.toString()
      }
    } catch {
      return trimmed
    }
    return trimmed
  }

  if (trimmed.startsWith("/uploads/")) {
    return `${API_BASE}${withStaticUploadsPath(trimmed)}`
  }

  if (trimmed.startsWith("/static/uploads/")) {
    return `${API_BASE}${trimmed}`
  }

  if (trimmed.startsWith("uploads/")) {
    return `${API_BASE}/static/${trimmed}`
  }

  if (trimmed.startsWith("static/uploads/")) {
    return `${API_BASE}/${trimmed}`
  }

  if (trimmed.startsWith("/")) {
    return trimmed
  }

  return `/${trimmed}`
}