import { useState, type FormEvent } from 'react'
import { useTenantRouteLookup } from '../hooks/useTenantRouteLookup'

export function TenantRouteLookup() {
  const [routeId, setRouteId] = useState('')
  const { route, isLoading, errorMessage, findRoute } = useTenantRouteLookup()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await findRoute(Number(routeId))
  }

  return (
    <section className="tenantPanel tenantRouteLookup">
      <div className="tenantPanelHeader">
        <div>
          <p className="eyebrow">Route details</p>
          <h2>Find a route</h2>
        </div>
      </div>
      <form className="tenantLookupForm" onSubmit={handleSubmit}>
        <label className="tenantField" htmlFor="tenantRouteLookupId">
          Route ID
          <input
            id="tenantRouteLookupId"
            min={1}
            onChange={(event) => setRouteId(event.target.value)}
            required
            step={1}
            type="number"
            value={routeId}
          />
        </label>
        <button className="secondaryButton" disabled={isLoading} type="submit">
          {isLoading ? 'Searching…' : 'Find route'}
        </button>
      </form>
      {errorMessage && (
        <p className="tenantLookupError" role="alert">
          {errorMessage}
        </p>
      )}
      {route && (
        <div className="tenantRouteLookupDetails">
          <div>
            <span className="tenantDetailLabel">Name</span>
            <strong>{route.name}</strong>
          </div>
          <div>
            <span className="tenantDetailLabel">Route key</span>
            <strong>{route.routeId}</strong>
          </div>
          <div>
            <span className="tenantDetailLabel">Path</span>
            <code>{route.pathPattern}</code>
          </div>
          <div>
            <span className="tenantDetailLabel">Target</span>
            <code>
              {route.targetBaseUrl}
              {route.targetPathPrefix}
            </code>
          </div>
          <div>
            <span className="tenantDetailLabel">Status</span>
            <strong>{route.active ? 'Active' : 'Inactive'}</strong>
          </div>
          <div>
            <span className="tenantDetailLabel">Configuration version</span>
            <strong>{route.configurationVersion}</strong>
          </div>
          <div>
            <span className="tenantDetailLabel">Methods</span>
            <strong>{route.allowedMethods.join(', ')}</strong>
          </div>
          <div>
            <span className="tenantDetailLabel">Header rules</span>
            <strong>{route.headerRules.length}</strong>
          </div>
        </div>
      )}
    </section>
  )
}
