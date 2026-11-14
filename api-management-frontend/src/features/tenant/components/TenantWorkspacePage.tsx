import { useState } from 'react'
import type { AuthSession } from '../../auth/services/sessionStore'
import { WorkspaceHeader } from '../../workspace/components/WorkspaceHeader'
import type { TenantRoute } from '../services/tenantService'
import { useTenantWorkspace } from '../hooks/useTenantWorkspace'
import { useTenantAuditRecords } from '../hooks/useTenantAuditRecords'
import { TenantAuditPanel } from './TenantAuditPanel'
import { TenantOrganizationCard } from './TenantOrganizationCard'
import { TenantRouteForm } from './TenantRouteForm'
import { TenantRouteHistoryDialog } from './TenantRouteHistoryDialog'
import { TenantRouteLookup } from './TenantRouteLookup'
import { TenantRoutesPanel } from './TenantRoutesPanel'
import './tenant.css'

type TenantWorkspacePageProps = {
  session: AuthSession
  onSignOut: () => void
}

export function TenantWorkspacePage({
  session,
  onSignOut,
}: TenantWorkspacePageProps) {
  const [editingRoute, setEditingRoute] = useState<TenantRoute | null>(null)
  const [isRouteFormOpen, setIsRouteFormOpen] = useState(false)
  const [historyRoute, setHistoryRoute] = useState<TenantRoute | null>(null)
  const {
    organization,
    routes,
    isLoadingOrganization,
    isLoadingRoutes,
    isSavingOrganization,
    isSavingRoute,
    organizationError,
    routesError,
    routeVersions,
    routeVersionsError,
    isLoadingRouteVersions,
    successMessage,
    loadOrganization,
    loadRoutes,
    saveOrganizationName,
    saveRoute,
    changeRouteStatus,
    removeRoute,
    loadRouteVersions,
    clearRouteVersions,
  } = useTenantWorkspace()
  const auditRecords = useTenantAuditRecords()

  function openCreateRoute() {
    setEditingRoute(null)
    setIsRouteFormOpen(true)
  }

  function openEditRoute(route: TenantRoute) {
    setEditingRoute(route)
    setIsRouteFormOpen(true)
  }

  async function confirmDeleteRoute(route: TenantRoute) {
    if (window.confirm(`Delete the ${route.name} route?`)) {
      await removeRoute(route)
    }
  }

  async function toggleRouteStatus(route: TenantRoute) {
    const nextActive = !route.active
    const action = nextActive ? 'activate' : 'deactivate'
    if (window.confirm(`${action[0].toUpperCase()}${action.slice(1)} ${route.name}?`)) {
      await changeRouteStatus(route, nextActive)
    }
  }

  function openRouteHistory(route: TenantRoute) {
    setHistoryRoute(route)
    void loadRouteVersions(route.routeId)
  }

  return (
    <main className="appShell">
      <WorkspaceHeader
        onSignOut={onSignOut}
        roleLabel="Tenant administrator"
        username={session.username}
      />
      <section className="tenantWorkspace" aria-labelledby="tenantPageTitle">
        <div className="tenantPageHeading">
          <div>
            <p className="eyebrow">Tenant administration</p>
            <h1 id="tenantPageTitle">Tenant workspace</h1>
            <p>Manage your organization and view its API routes.</p>
          </div>
          {organization && (
            <span className="tenantOrganizationId">
              Organization ID {organization.id}
            </span>
          )}
        </div>
        <TenantOrganizationCard
          errorMessage={organizationError}
          isLoading={isLoadingOrganization}
          isSaving={isSavingOrganization}
          onRetry={loadOrganization}
          onSaveName={saveOrganizationName}
          organization={organization}
          successMessage={successMessage}
        />
        <TenantRoutesPanel
          errorMessage={routesError}
          isLoading={isLoadingRoutes}
          onCreate={openCreateRoute}
          onDelete={confirmDeleteRoute}
          onEdit={openEditRoute}
          onHistory={openRouteHistory}
          onRetry={loadRoutes}
          onToggleStatus={toggleRouteStatus}
          routes={routes}
        />
        <TenantRouteLookup />
        <TenantAuditPanel
          errorMessage={auditRecords.errorMessage}
          isLoading={auditRecords.isLoading}
          onRefresh={auditRecords.loadRecords}
          records={auditRecords.records}
        />
      </section>
      {isRouteFormOpen && organization && (
        <TenantRouteForm
          errorMessage={routesError}
          isSaving={isSavingRoute}
          onCancel={() => setIsRouteFormOpen(false)}
          onSave={(input) => saveRoute(input, editingRoute?.id ?? null)}
          organizationSlug={organization.slug}
          route={editingRoute}
        />
      )}
      {historyRoute && (
        <TenantRouteHistoryDialog
          errorMessage={routeVersionsError}
          isLoading={isLoadingRouteVersions}
          onClose={() => {
            setHistoryRoute(null)
            clearRouteVersions()
          }}
          onRetry={() => loadRouteVersions(historyRoute.routeId)}
          route={historyRoute}
          versions={routeVersions}
        />
      )}
    </main>
  )
}
