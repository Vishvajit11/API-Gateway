export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'TENANT_ADMIN'
  | 'GATEWAY_SERVICE'

export type LoginResponse = {
  token: string
  tokenType: string
  expiresInSeconds: number
  role: UserRole
  organizationId: number | null
}

export type AuthSession = LoginResponse & {
  username: string
  expiresAt: number
}

const sessionStorageKey = 'apiManagementSession'
const allowedRoles: UserRole[] = [
  'PLATFORM_ADMIN',
  'TENANT_ADMIN',
  'GATEWAY_SERVICE',
]

export function getSavedSession(): AuthSession | null {
  const savedValue = window.sessionStorage.getItem(sessionStorageKey)
  if (!savedValue) {
    return null
  }

  const parsedValue = parseSession(savedValue)
  if (!isAuthSession(parsedValue) || parsedValue.expiresAt <= Date.now()) {
    clearSession()
    return null
  }

  return parsedValue
}

export function saveSession(
  response: LoginResponse,
  username: string,
): AuthSession {
  if (!isValidLoginResponse(response)) {
    throw new Error('The service returned an invalid login response.')
  }

  const session: AuthSession = {
    ...response,
    username,
    expiresAt: Date.now() + response.expiresInSeconds * 1000,
  }

  window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(session))
  return session
}

export function clearSession(): void {
  window.sessionStorage.removeItem(sessionStorageKey)
}

function parseSession(value: string): unknown {
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false
  }

  const session = value as Partial<AuthSession>
  return (
    isValidLoginResponse(session) &&
    typeof session.username === 'string' &&
    typeof session.expiresAt === 'number'
  )
}

function isValidLoginResponse(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false
  }

  const response = value as Partial<LoginResponse>
  return (
    typeof response.token === 'string' &&
    response.token.length > 0 &&
    typeof response.tokenType === 'string' &&
    response.tokenType.toLowerCase() === 'bearer' &&
    typeof response.expiresInSeconds === 'number' &&
    Number.isFinite(response.expiresInSeconds) &&
    response.expiresInSeconds > 0 &&
    typeof response.role === 'string' &&
    allowedRoles.includes(response.role as UserRole) &&
    (typeof response.organizationId === 'number' ||
      response.organizationId === null)
  )
}
