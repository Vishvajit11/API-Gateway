import { useEffect, useState, type FormEvent } from 'react'
import { useTenantAdmin } from '../hooks/useTenantAdmin'
import type { Organization } from '../services/organizationService'

type TenantAdminPanelProps = {
  organization: Organization
  onClose: () => void
}

export function TenantAdminPanel({
  organization,
  onClose,
}: TenantAdminPanelProps) {
  const {
    tenantAdmin,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    loadTenantAdmin,
    save,
    remove,
  } = useTenantAdmin(organization.id)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    setUsername(tenantAdmin?.username ?? '')
    setPassword('')
    setEnabled(tenantAdmin?.enabled ?? true)
  }, [tenantAdmin])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (await save({ username: username.trim(), password, enabled })) {
      setPassword('')
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete the tenant administrator for ${organization.name}?`,
    )
    if (confirmed) {
      await remove()
    }
  }

  return (
    <div
      className="tenantAdminOverlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        aria-labelledby="tenantAdminTitle"
        aria-modal="true"
        className="tenantAdminDialog"
        role="dialog"
      >
        <div className="tenantAdminHeader">
          <div>
            <p className="eyebrow">Organization access</p>
            <h2 id="tenantAdminTitle">Tenant administrator</h2>
            <p>{organization.name}</p>
          </div>
          <button
            aria-label="Close tenant administrator panel"
            className="dialogCloseButton"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="notice errorNotice" role="alert">
            <span>{errorMessage}</span>
            <button className="textButton" onClick={loadTenantAdmin}>
              Retry
            </button>
          </div>
        )}
        {successMessage && (
          <p className="notice successNotice" role="status">
            {successMessage}
          </p>
        )}

        {isLoading ? (
          <p className="organizationsLoading" role="status">
            Loading tenant administrator…
          </p>
        ) : (
          <form className="tenantAdminForm" onSubmit={handleSubmit}>
            <p className="tenantAdminDescription">
              {tenantAdmin
                ? 'Update sign-in details or disable this account.'
                : 'Create one tenant administrator account for this organization.'}
            </p>
            <label className="organizationField" htmlFor="tenantAdminUsername">
              <span>Username</span>
              <input
                autoComplete="username"
                id="tenantAdminUsername"
                maxLength={100}
                onChange={(event) => setUsername(event.target.value)}
                required
                value={username}
              />
            </label>
            <label className="organizationField" htmlFor="tenantAdminPassword">
              <span>{tenantAdmin ? 'New password' : 'Password'}</span>
              <input
                autoComplete="new-password"
                id="tenantAdminPassword"
                maxLength={100}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <label className="tenantAdminEnabled" htmlFor="tenantAdminEnabled">
              <input
                checked={enabled}
                id="tenantAdminEnabled"
                onChange={(event) => setEnabled(event.target.checked)}
                type="checkbox"
              />
              <span>Account enabled</span>
            </label>
            <div className="tenantAdminActions">
              {tenantAdmin && (
                <button
                  className="textButton dangerButton"
                  disabled={isSaving}
                  onClick={handleDelete}
                  type="button"
                >
                  Delete admin
                </button>
              )}
              <button
                className="primaryButton"
                disabled={isSaving}
                type="submit"
              >
                {isSaving
                  ? 'Saving…'
                  : tenantAdmin
                    ? 'Save changes'
                    : 'Create admin'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
