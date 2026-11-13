import type {
  Organization,
  OrganizationStatus,
} from '../services/organizationService'

type OrganizationTableProps = {
  organizations: Organization[]
  onEdit: (organization: Organization) => void
  onManageAdmin: (organization: Organization) => void
  onRemove: (organization: Organization) => void
  onStatusChange: (
    organizationId: number,
    status: OrganizationStatus,
  ) => void
}

const availableStatuses: OrganizationStatus[] = [
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
]

export function OrganizationTable({
  organizations,
  onEdit,
  onManageAdmin,
  onRemove,
  onStatusChange,
}: OrganizationTableProps) {
  if (organizations.length === 0) {
    return (
      <div className="organizationsEmpty">
        <h2>No organizations yet</h2>
        <p>Create an organization to start managing tenant access.</p>
      </div>
    )
  }

  return (
    <div className="organizationTableScroll">
      <table className="organizationTable">
        <thead>
          <tr>
            <th scope="col">Organization</th>
            <th scope="col">Slug</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <tr key={organization.id}>
              <td>
                <span className="organizationName">{organization.name}</span>
                <span className="organizationId">ID {organization.id}</span>
              </td>
              <td>{organization.slug}</td>
              <td>
                <span
                  className={`statusBadge status${organization.status.toLowerCase()}`}
                >
                  {organization.status.toLowerCase()}
                </span>
              </td>
              <td>{formatDate(organization.createdAt)}</td>
              <td>
                <div className="organizationActions">
                  <button
                    className="textButton"
                    onClick={() => onEdit(organization)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="textButton"
                    onClick={() => onManageAdmin(organization)}
                    type="button"
                  >
                    Tenant admin
                  </button>
                  <select
                    aria-label={`Change status for ${organization.name}`}
                    onChange={(event) =>
                      onStatusChange(
                        organization.id,
                        event.target.value as OrganizationStatus,
                      )
                    }
                    value={organization.status}
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        Set {status.toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    className="textButton dangerButton"
                    onClick={() => onRemove(organization)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}
