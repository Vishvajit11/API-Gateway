import type { RouteVersion, TenantRoute } from '../services/tenantService'

type TenantRouteHistoryDialogProps = {
  route: TenantRoute
  versions: RouteVersion[]
  errorMessage: string
  isLoading: boolean
  onRetry: () => void
  onClose: () => void
}

export function TenantRouteHistoryDialog({
  route,
  versions,
  errorMessage,
  isLoading,
  onRetry,
  onClose,
}: TenantRouteHistoryDialogProps) {
  return (
    <div className="tenantRouteOverlay">
      <section
        aria-labelledby="routeHistoryTitle"
        aria-modal="true"
        className="tenantRouteDialog routeHistoryDialog"
        role="dialog"
      >
        <div className="tenantRouteDialogHeader">
          <div>
            <p className="eyebrow">Configuration history</p>
            <h2 id="routeHistoryTitle">{route.name}</h2>
            <p className="tenantRouteId">{route.routeId}</p>
          </div>
          <button
            aria-label="Close route history"
            className="dialogCloseButton"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {isLoading ? (
          <p className="tenantLoading" role="status">
            Loading route history…
          </p>
        ) : errorMessage ? (
          <div className="tenantNotice tenantError" role="alert">
            <span>{errorMessage}</span>
            <button className="textButton" onClick={onRetry}>
              Retry
            </button>
          </div>
        ) : versions.length === 0 ? (
          <p className="tenantLoading" role="status">
            No configuration history found.
          </p>
        ) : (
          <div className="routeVersionList">
            {versions.map((version) => (
              <details className="routeVersionItem" key={version.id}>
                <summary>
                  <span className="routeVersionTitle">
                    Version {version.versionNumber}
                    <span>{version.changeType.toLowerCase()}</span>
                  </span>
                  <time dateTime={version.createdAt}>
                    {formatDate(version.createdAt)}
                  </time>
                </summary>
                <pre>{formatSnapshot(version.configurationSnapshot)}</pre>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

function formatSnapshot(snapshot: string): string {
  try {
    return JSON.stringify(JSON.parse(snapshot) as unknown, null, 2)
  } catch {
    return snapshot
  }
}
