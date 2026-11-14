import type { TenantRoute } from '../services/tenantService'

type TenantRoutesPanelProps = {
  routes: TenantRoute[]
  isLoading: boolean
  errorMessage: string
  onCreate: () => void
  onEdit: (route: TenantRoute) => void
  onDelete: (route: TenantRoute) => void
  onToggleStatus: (route: TenantRoute) => void
  onHistory: (route: TenantRoute) => void
  onRetry: () => void
}

export function TenantRoutesPanel({
  routes,
  isLoading,
  errorMessage,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
  onHistory,
  onRetry,
}: TenantRoutesPanelProps) {
  return (
    <section
      className="tenantPanel tenantRoutesPanel"
      aria-labelledby="tenantRoutesTitle"
    >
      <div className="tenantPanelHeader">
        <div>
          <p className="eyebrow">API configuration</p>
          <h2 id="tenantRoutesTitle">Your API routes</h2>
        </div>
        <div className="tenantRoutesHeaderActions">
          <span className="tenantRouteCount">{routes.length} routes</span>
          <button className="primaryButton" onClick={onCreate} type="button">
            Add route
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="tenantNotice tenantError" role="alert">
          <span>{errorMessage}</span>
          <button className="textButton" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <p className="tenantLoading" role="status">
          Loading routes…
        </p>
      ) : routes.length === 0 ? (
        <div className="tenantEmptyState">
          <h3>No routes configured</h3>
          <p>Routes you create for this organization will appear here.</p>
        </div>
      ) : (
        <div className="tenantRouteList">
          {routes.map((route) => (
            <article className="tenantRouteCard" key={route.id}>
              <div className="tenantRouteMain">
                <div>
                  <div className="tenantRouteTitle">
                    <h3>{route.name}</h3>
                    <span
                      className={`tenantRouteStatus ${route.active ? 'routeActive' : 'routeInactive'}`}
                    >
                      {route.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="tenantRouteId">{route.routeId}</p>
                </div>
                <span className="tenantRouteVersion">
                  Version {route.configurationVersion}
                </span>
              </div>
              <div className="tenantRouteDetails">
                <div>
                  <span className="tenantDetailLabel">Path</span>
                  <code>{route.pathPattern}</code>
                </div>
                <div>
                  <span className="tenantDetailLabel">Methods</span>
                  <span>{route.allowedMethods.join(', ')}</span>
                </div>
                <div>
                  <span className="tenantDetailLabel">Target</span>
                  <code>
                    {route.targetBaseUrl}
                    {route.targetPathPrefix}
                  </code>
                </div>
                <div>
                  <span className="tenantDetailLabel">Timeout</span>
                  <span>{route.responseTimeoutMs} ms</span>
                </div>
              </div>
              <div className="tenantRouteActions">
                <button
                  className="textButton"
                  onClick={() => onEdit(route)}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="textButton"
                  onClick={() => onHistory(route)}
                  type="button"
                >
                  History
                </button>
                <button
                  className="textButton"
                  onClick={() => onToggleStatus(route)}
                  type="button"
                >
                  {route.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="textButton dangerButton"
                  onClick={() => onDelete(route)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
