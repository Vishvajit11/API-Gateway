import type { AuditRecord } from '../services/tenantService'

type TenantAuditPanelProps = {
  records: AuditRecord[]
  isLoading: boolean
  errorMessage: string
  onRefresh: () => void
}

export function TenantAuditPanel({
  records,
  isLoading,
  errorMessage,
  onRefresh,
}: TenantAuditPanelProps) {
  return (
    <section className="tenantPanel" aria-labelledby="tenantAuditTitle">
      <div className="tenantPanelHeader">
        <div>
          <p className="eyebrow">Activity</p>
          <h2 id="tenantAuditTitle">Audit history</h2>
        </div>
        <button
          className="secondaryButton"
          disabled={isLoading}
          onClick={onRefresh}
          type="button"
        >
          {isLoading ? 'Loading…' : 'Refresh'}
        </button>
      </div>
      {errorMessage ? (
        <div className="tenantNotice tenantError" role="alert">
          <span>{errorMessage}</span>
          <button className="textButton" onClick={onRefresh} type="button">
            Retry
          </button>
        </div>
      ) : isLoading && records.length === 0 ? (
        <p className="tenantLoading" role="status">
          Loading audit history…
        </p>
      ) : records.length === 0 ? (
        <div className="tenantEmptyState">
          <h3>No activity yet</h3>
          <p>Organization and route changes will appear here.</p>
        </div>
      ) : (
        <div className="tenantAuditScroll">
          <table className="tenantAuditTable">
            <thead>
              <tr>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
                <th scope="col">Actor</th>
                <th scope="col">Result</th>
                <th scope="col">Duration</th>
                <th scope="col">Time</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{formatAction(record.action)}</td>
                  <td>
                    <span>{record.resourceType}</span>
                    <span className="tenantAuditResourceId">
                      {record.resourceId}
                    </span>
                  </td>
                  <td>{record.actor}</td>
                  <td>
                    <span
                      className={`tenantAuditResult result${record.result.toLowerCase()}`}
                    >
                      {record.result.toLowerCase()}
                    </span>
                  </td>
                  <td>{record.durationMs} ms</td>
                  <td>{formatDate(record.createdAt)}</td>
                  <td className="tenantAuditDetails">
                    {record.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function formatAction(action: string): string {
  return action
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
