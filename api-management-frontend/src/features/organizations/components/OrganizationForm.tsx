import { useState, type FormEvent } from 'react'
import type {
  Organization,
  OrganizationInput,
} from '../services/organizationService'

type OrganizationFormProps = {
  organization: Organization | null
  isSaving: boolean
  onCancel: () => void
  onSave: (input: OrganizationInput) => Promise<boolean>
}

export function OrganizationForm({
  organization,
  isSaving,
  onCancel,
  onSave,
}: OrganizationFormProps) {
  const [name, setName] = useState(organization?.name ?? '')
  const [slug, setSlug] = useState(organization?.slug ?? '')
  const [validationMessage, setValidationMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationMessage('')

    if (!name.trim()) {
      setValidationMessage('Organization name is required.')
      return
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setValidationMessage(
        'Use lowercase letters, numbers, and single hyphens for the slug.',
      )
      return
    }

    if (await onSave({ name: name.trim(), slug })) {
      onCancel()
    }
  }

  return (
    <form className="organizationForm" onSubmit={handleSubmit}>
      <div className="organizationFormHeader">
        <h2>{organization ? 'Edit organization' : 'Create organization'}</h2>
        <p>New organizations start with pending status.</p>
      </div>
      <div className="organizationFormFields">
        <label className="organizationField" htmlFor="organizationName">
          <span>Name</span>
          <input
            autoComplete="organization"
            id="organizationName"
            maxLength={150}
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>
        <label className="organizationField" htmlFor="organizationSlug">
          <span>Slug</span>
          <input
            autoComplete="off"
            id="organizationSlug"
            maxLength={100}
            onChange={(event) => setSlug(event.target.value)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
            value={slug}
          />
        </label>
      </div>
      {validationMessage && (
        <p className="organizationError" role="alert">
          {validationMessage}
        </p>
      )}
      <div className="organizationFormActions">
        <button className="secondaryButton" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="primaryButton" disabled={isSaving} type="submit">
          {isSaving ? 'Saving…' : organization ? 'Save changes' : 'Create'}
        </button>
      </div>
    </form>
  )
}
