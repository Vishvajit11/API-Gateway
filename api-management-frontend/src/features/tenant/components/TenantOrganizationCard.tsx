import { useState, type FormEvent } from 'react'
import type { TenantOrganization } from '../services/tenantService'

type TenantOrganizationCardProps = {
  organization: TenantOrganization | null
  isLoading: boolean
  isSaving: boolean
  errorMessage: string
  successMessage: string
  onRetry: () => void
  onSaveName: (name: string) => Promise<boolean>
}

export function TenantOrganizationCard({
  organization,
  isLoading,
  isSaving,
  errorMessage,
  successMessage,
  onRetry,
  onSaveName,
}: TenantOrganizationCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')

  function startEditing() {
    setName(organization?.name ?? '')
    setIsEditing(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (await onSaveName(name.trim())) {
      setIsEditing(false)
    }
  }

  return (
    <section className="tenantPanel" aria-labelledby="tenantOrganizationTitle">
      <div className="tenantPanelHeader">
        <div>
          <p className="eyebrow">Organization</p>
          <h2 id="tenantOrganizationTitle">Your organization</h2>
        </div>
        {!isLoading && organization && !isEditing && (
          <button className="secondaryButton" onClick={startEditing}>
            Edit name
          </button>
        )}
      </div>
      {errorMessage && (
        <div className="tenantNotice tenantError" role="alert">
          <span>{errorMessage}</span>
          <button className="textButton" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      {successMessage && (
        <p className="tenantNotice tenantSuccess" role="status">
          {successMessage}
        </p>
      )}
      {isLoading ? (
        <p className="tenantLoading" role="status">
          Loading organization…
        </p>
      ) : organization ? (
        isEditing ? (
          <form className="tenantNameForm" onSubmit={handleSubmit}>
            <label className="tenantField" htmlFor="tenantOrganizationName">
              Organization name
              <input
                autoComplete="organization"
                id="tenantOrganizationName"
                maxLength={150}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
            <div className="tenantFormActions">
              <button
                className="secondaryButton"
                onClick={() => setIsEditing(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="primaryButton"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Saving…' : 'Save name'}
              </button>
            </div>
          </form>
        ) : (
          <div className="tenantOrganizationDetails">
            <div>
              <span className="tenantDetailLabel">Name</span>
              <strong>{organization.name}</strong>
            </div>
            <div>
              <span className="tenantDetailLabel">Slug</span>
              <strong>{organization.slug}</strong>
            </div>
            <div>
              <span className="tenantDetailLabel">Status</span>
              <span
                className={`tenantStatus tenantStatus${organization.status.toLowerCase()}`}
              >
                {organization.status.toLowerCase()}
              </span>
            </div>
          </div>
        )
      ) : null}
    </section>
  )
}
