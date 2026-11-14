import type { UserRole } from '../auth/services/sessionStore'

type WorkspaceDetails = {
  label: string
  title: string
  description: string
}

const workspaceByRole: Record<UserRole, WorkspaceDetails> = {
  PLATFORM_ADMIN: {
    label: 'Platform administrator',
    title: 'Platform workspace',
    description: 'Manage organizations and their tenant administrators.',
  },
  TENANT_ADMIN: {
    label: 'Tenant administrator',
    title: 'Tenant workspace',
    description: 'Manage your organization and its API routes.',
  },
  GATEWAY_SERVICE: {
    label: 'Gateway service',
    title: 'Gateway workspace',
    description: 'Access gateway route configuration.',
  },
}

export function getWorkspaceDetails(role: UserRole): WorkspaceDetails {
  return workspaceByRole[role]
}
