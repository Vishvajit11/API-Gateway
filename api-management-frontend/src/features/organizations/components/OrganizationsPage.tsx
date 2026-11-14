import { useState } from 'react'
import { WorkspaceHeader } from '../../workspace/components/WorkspaceHeader'
import type { AuthSession } from '../../auth/services/sessionStore'
import { OrganizationForm } from './OrganizationForm'
import { OrganizationLookup } from './OrganizationLookup'
import { OrganizationTable } from './OrganizationTable'
import { TenantAdminPanel } from './TenantAdminPanel'
import { useOrganizations } from '../hooks/useOrganizations'
import type { Organization } from '../services/organizationService'
import './organizations.css'

type OrganizationsPageProps = {
  session: AuthSession
  onSignOut: () => void
}

export function OrganizationsPage({
  session,
  onSignOut,
}: OrganizationsPageProps) {
  const {
    organizations,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    loadOrganizations,
    save,
    changeStatus,
    remove,
  } = useOrganizations()
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null)
  const [managingAdminOrganization, setManagingAdminOrganization] =
    useState<Organization | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  function openCreateForm() {
    setEditingOrganization(null)
    setIsFormOpen(true)
  }

  function openEditForm(organization: Organization) {
    setEditingOrganization(organization)
    setIsFormOpen(true)
  }

  async function confirmRemove(organization: Organization) {
    const confirmed = window.confirm(
      `Delete ${organization.name}? This will soft-delete the organization.`,
    )
    if (confirmed) {
      await remove(organization.id)
    }
  }

  return (
    <main className="appShell">
      <WorkspaceHeader
        onSignOut={onSignOut}
        roleLabel="Platform administrator"
        username={session.username}
      />
      <section className="organizationsPage" aria-labelledby="pageTitle">
        <div className="organizationsHeading">
          <div>
            <p className="eyebrow">Platform administration</p>
            <h1 id="pageTitle">Organizations</h1>
            <p className="organizationsDescription">
              Create and manage organizations using the API Management Service.
            </p>
          </div>
          {!isFormOpen && (
            <button className="primaryButton" onClick={openCreateForm}>
              Create organization
            </button>
          )}
        </div>
        {errorMessage && (
          <div className="notice errorNotice" role="alert">
            <span>{errorMessage}</span>
            <button className="textButton" onClick={loadOrganizations}>
              Retry
            </button>
          </div>
        )}
        {successMessage && (
          <p className="notice successNotice" role="status">
            {successMessage}
          </p>
        )}
        {isFormOpen && (
          <OrganizationForm
            isSaving={isSaving}
            onCancel={() => setIsFormOpen(false)}
            onSave={(input) => save(input, editingOrganization?.id ?? null)}
            organization={editingOrganization}
          />
        )}
        <OrganizationLookup />
        <section className="organizationsPanel" aria-label="Organization list">
          <div className="organizationsPanelHeader">
            <div>
              <h2>All organizations</h2>
              <p>{organizations.length} organizations</p>
            </div>
            <button
              aria-label="Refresh organizations"
              className="secondaryButton"
              disabled={isLoading}
              onClick={loadOrganizations}
            >
              {isLoading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
          {isLoading && organizations.length === 0 ? (
            <p className="organizationsLoading" role="status">
              Loading organizations…
            </p>
          ) : (
            <OrganizationTable
              onEdit={openEditForm}
              onManageAdmin={setManagingAdminOrganization}
              onRemove={confirmRemove}
              onStatusChange={changeStatus}
              organizations={organizations}
            />
          )}
        </section>
      </section>
      {managingAdminOrganization && (
        <TenantAdminPanel
          onClose={() => setManagingAdminOrganization(null)}
          organization={managingAdminOrganization}
        />
      )}
    </main>
  )
}
