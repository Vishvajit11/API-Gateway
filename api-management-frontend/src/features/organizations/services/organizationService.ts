import { requestApi } from '../../../api/apiClient'

export type OrganizationStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED'

export type Organization = {
  id: number
  name: string
  slug: string
  status: OrganizationStatus
  createdAt: string
  updatedAt: string
}

export type OrganizationInput = {
  name: string
  slug: string
}

export type TenantAdmin = {
  id: number
  organizationId: number
  username: string
  enabled: boolean
}

export type TenantAdminInput = {
  username: string
  password: string
  enabled: boolean
}

const organizationsPath = '/api/platform/organizations'

export function getOrganizations(): Promise<Organization[]> {
  return requestApi<Organization[]>(organizationsPath)
}

export function createOrganization(
  input: OrganizationInput,
): Promise<Organization> {
  return requestApi<Organization>(organizationsPath, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateOrganization(
  id: number,
  input: OrganizationInput,
): Promise<Organization> {
  return requestApi<Organization>(`${organizationsPath}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function updateOrganizationStatus(
  id: number,
  status: Exclude<OrganizationStatus, 'DELETED'>,
): Promise<Organization> {
  return requestApi<Organization>(`${organizationsPath}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function deleteOrganization(id: number): Promise<void> {
  return requestApi<void>(`${organizationsPath}/${id}`, {
    method: 'DELETE',
  })
}

export function getTenantAdmin(organizationId: number): Promise<TenantAdmin> {
  return requestApi<TenantAdmin>(
    `${organizationsPath}/${organizationId}/tenant-admin`,
  )
}

export function createTenantAdmin(
  organizationId: number,
  input: TenantAdminInput,
): Promise<TenantAdmin> {
  return requestApi<TenantAdmin>(
    `${organizationsPath}/${organizationId}/tenant-admin`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export function updateTenantAdmin(
  organizationId: number,
  input: TenantAdminInput,
): Promise<TenantAdmin> {
  return requestApi<TenantAdmin>(
    `${organizationsPath}/${organizationId}/tenant-admin`,
    {
      method: 'PUT',
      body: JSON.stringify(input),
    },
  )
}

export function deleteTenantAdmin(organizationId: number): Promise<void> {
  return requestApi<void>(
    `${organizationsPath}/${organizationId}/tenant-admin`,
    {
      method: 'DELETE',
    },
  )
}
