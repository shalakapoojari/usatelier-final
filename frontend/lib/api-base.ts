let csrfToken: string | null = null
let csrfPromise: Promise<string | null> | null = null

function normalizeApiBase(raw: string): string {
  const value = raw.trim().replace(/\/+$/, "")
  if (!value) return value

  // Avoid mixed content in production (HTTPS page cannot call HTTP API).
  if (value.startsWith("http://") && !value.includes("localhost") && !value.includes("127.0.0.1")) {
    return `https://${value.slice("http://".length)}`
  }
  return value
}

export function getApiBase(): string {
  const envBase = process.env.NEXT_PUBLIC_API_BASE
  if (envBase) return normalizeApiBase(envBase)

  // Client-side
  if (typeof window !== "undefined") {
    const host = window.location.hostname

    const isLocalHost =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.")

    if (isLocalHost) {
      return "http://localhost:5000"   // ✅ FIXED
    }

    // Production fallback
    return "https://api.usatelier.in"
  }

  // Server-side fallback (Next.js SSR)
  return "http://localhost:5000"   // ✅ FIXED
}

/**
 * Ensures a CSRF token is available. If one is already being fetched,
 * it returns the existing promise to avoid redundant network calls.
 */
export async function ensureCSRFToken(API_BASE: string): Promise<string | null> {
  if (csrfToken) return csrfToken
  if (csrfPromise) return csrfPromise

  csrfPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/csrf-token`, { credentials: "include" })
      if (!res.ok) throw new Error(`CSRF fetch failed: ${res.status}`)
      const data = await res.json()
      csrfToken = data.csrf_token
      return csrfToken
    } catch (err) {
      console.error("CSRF Initialization Error:", err)
      return null
    } finally {
      csrfPromise = null
    }
  })()

  return csrfPromise
}

export function clearCSRFToken() {
  csrfToken = null
}

export async function apiFetch(
  API_BASE: string,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() || "GET"
  const isMutating = ["POST", "PUT", "DELETE", "PATCH"].includes(method)

  // Skip CSRF for the token endpoint itself
  if (isMutating && !url.includes("/api/csrf-token")) {
    await ensureCSRFToken(API_BASE)
  }

  const doFetch = () => fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    } as HeadersInit,
  })

  let response = await doFetch()

  // Retry once if 403 Forbidden (likely expired CSRF token)
  if (response.status === 403 && isMutating) {
    console.warn("CSRF 403 error. Retrying once with fresh token...")
    csrfToken = null // force refresh
    await ensureCSRFToken(API_BASE)
    response = await doFetch()
  }

  // SECURITY: Global 401 handler — redirect to login when session has expired
  if (response.status === 401 && typeof window !== "undefined") {
    const currentPath = window.location.pathname
    // Don't redirect from auth pages (prevents infinite redirect loop)
    if (!currentPath.startsWith("/login") && !currentPath.startsWith("/auth")) {
      // Small delay so any pending toasts can show
      window.setTimeout(() => {
        window.location.href = "/login?session=expired"
      }, 300)
    }
  }

  return response
}

/**
 * Legacy support for manual initialization if needed.
 */
export async function initCSRF(API_BASE: string) {
  await ensureCSRFToken(API_BASE)
}


