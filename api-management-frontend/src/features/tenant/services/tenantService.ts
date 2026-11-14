import { requestApi } from '../../../api/apiClient'

export type TenantOrganization = {
  id: number
  name: string
  slug: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  createdAt: string
  updatedAt: string
}

export type TenantRoute = {
  id: number
  organizationId: number
  routeId: string
  name: string
  pathPattern: string
  targetBaseUrl: string
  targetPathPrefix: string
  requestsPerMinute: number | null
  responseTimeoutMs: number
  idempotencyEnabled: boolean
  active: boolean
  configurationVersion: number
  allowedMethods: string[]
  headerRules: HeaderRule[]
  createdAt: string
  updatedAt: string
}

export type HeaderRule = {
    id: number
    direction: string
    action: string
    headerName: string
    headerValue: string | null
}

export type RouteInput = {
  routeId: string
  name: string
  pathPattern: string
  targetBaseUrl: string
  targetPathPrefix: string
  requestsPerMinute: number | null
  responseTimeoutMs: number
  idempotencyEnabled: boolean
  active: boolean
  allowedMethods: string[]
  headerRules: Omit<HeaderRule, 'id'>[]
}

export type RouteVersion = {
  id: number
  routeId: string
  versionNumber: number
  changeType: string
  configurationSnapshot: string
  createdAt: string
}

export type AuditRecord = {
  id: number
  actor: string
  action: string
  resourceType: string
  resourceId: string
  correlationId: string | null
  durationMs: number
  result: string
  details: string | null
  createdAt: string
}

export function getOwnOrganization(): Promise<TenantOrganization> {
  return requestApi<TenantOrganization>('/api/tenant/organization')
}

export function updateOwnOrganization(name: string): Promise<TenantOrganization> {
  return requestApi<TenantOrganization>('/api/tenant/organization', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  })
}

export function getTenantRoutes(): Promise<TenantRoute[]> {
  return requestApi<TenantRoute[]>('/api/tenant/routes')
}

export function getTenantRouteById(routePk: number): Promise<TenantRoute> {
  return requestApi<TenantRoute>(`/api/tenant/routes/${routePk}`)
}

export function createTenantRoute(input: RouteInput): Promise<TenantRoute> {
  return requestApi<TenantRoute>('/api/tenant/routes', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTenantRoute(
  routePk: number,
  input: RouteInput,
): Promise<TenantRoute> {
  return requestApi<TenantRoute>(`/api/tenant/routes/${routePk}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function updateTenantRouteStatus(
  routePk: number,
  active: boolean,
): Promise<TenantRoute> {
  return requestApi<TenantRoute>(`/api/tenant/routes/${routePk}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ active }),
  })
}

export function deleteTenantRoute(routePk: number): Promise<void> {
  return requestApi<void>(`/api/tenant/routes/${routePk}`, {
    method: 'DELETE',
  })
}

export function getTenantRouteVersions(routeId: string): Promise<RouteVersion[]> {
  return requestApi<RouteVersion[]>(
    `/api/tenant/route-versions/${encodeURIComponent(routeId)}`,
  )
}

export function getTenantAuditRecords(): Promise<AuditRecord[]> {
  return requestApi<AuditRecord[]>('/api/tenant/audit-records')
}
