import { useState, type FormEvent } from 'react'
import { useOrganizationLookup } from '../hooks/useOrganizationLookup'

export function OrganizationLookup() {
  const [organizationId, setOrganizationId] = useState('')
  const { organization, isLoading, errorMessage, findOrganization } =
    useOrganizationLookup()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await findOrganization(Number(organizationId))
  }

  return (
    <section className="organizationsPanel organizationLookup">
      <div className="organizationsPanelHeader">
        <div>
          <h2>Find an organization</h2>
          <p>Look up an organization by its ID.</p>
        </div>
      </div>
      <form className="lookupForm" onSubmit={handleSubmit}>
        <label className="lookupField" htmlFor="organizationLookupId">
          Organization ID
          <input
            id="organizationLookupId"
            min={1}
            onChange={(event) => setOrganizationId(event.target.value)}
            required
            step={1}
            type="number"
            value={organizationId}
          />
        </label>
        <button className="secondaryButton" disabled={isLoading} type="submit">
          {isLoading ? 'Searching…' : 'Find organization'}
        </button>
      </form>
      {errorMessage && (
        <p className="lookupError" role="alert">
          {errorMessage}
        </p>
      )}
      {organization && (
        <dl className="lookupDetails">
          <div>
            <dt>Name</dt>
            <dd>{organization.name}</dd>
          </div>
          <div>
            <dt>Slug</dt>
            <dd>{organization.slug}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{organization.status.toLowerCase()}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDate(organization.createdAt)}</dd>
          </div>
        </dl>
      )}
    </section>
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
