import {
  clearSession,
  getSavedSession,
} from '../features/auth/services/sessionStore'
import { getApiUrl } from './apiConfig'

type ApiErrorResponse = {
  message?: unknown
  detail?: unknown
  error?: unknown
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function requestApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const session = getSavedSession()
  if (session) {
    headers.set('Authorization', `Bearer ${session.token}`)
  }

  const response = await fetch(getApiUrl(path), {
    ...options,
    headers,
  })

  const responseText = await response.text()
  const responseBody = parseResponseBody(responseText)

  if (!response.ok) {
    if (response.status === 401 && session) {
      clearSession()
      window.dispatchEvent(new Event('sessionExpired'))
    }

    throw new ApiError(getErrorMessage(responseBody, response), response.status)
  }

  if (response.status === 204 || responseText.length === 0) {
    return undefined as T
  }

  return responseBody as T
}

function parseResponseBody(responseText: string): unknown {
  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText) as unknown
  } catch {
    return responseText
  }
}

function getErrorMessage(body: unknown, response: Response): string {
  if (typeof body === 'string') {
    return body.length <= 300 ? body : response.statusText
  }

  if (body && typeof body === 'object') {
    const errorBody = body as ApiErrorResponse
    for (const candidate of [
      errorBody.message,
      errorBody.detail,
      errorBody.error,
    ]) {
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate
      }
    }
  }

  return response.statusText || `Request failed with status ${response.status}`
}
