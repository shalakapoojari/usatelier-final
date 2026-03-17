import { getApiBase } from "@/lib/api-base"

const API_BASE = getApiBase()

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
    return trimmed
  }

  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("/static/uploads/")) {
    return `${API_BASE}${trimmed}`
  }

  if (trimmed.startsWith("uploads/") || trimmed.startsWith("static/uploads/")) {
    return `${API_BASE}/${trimmed}`
  }

  if (trimmed.startsWith("/")) {
    return trimmed
  }

  return `/${trimmed}`
}