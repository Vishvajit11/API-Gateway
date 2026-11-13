import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
  updateOrganizationStatus,
  type Organization,
  type OrganizationInput,
  type OrganizationStatus,
} from '../services/organizationService'

const loadErrorMessage = 'Unable to load organizations. Please try again.'
const saveErrorMessage = 'Unable to save the organization. Please try again.'
const statusErrorMessage = 'Unable to update organization status.'
const deleteErrorMessage = 'Unable to delete the organization.'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadOrganizations = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      setOrganizations(await getOrganizations())
    } catch (error) {
      setErrorMessage(getErrorMessage(error, loadErrorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrganizations()
  }, [loadOrganizations])

  const save = useCallback(
    async (
      input: OrganizationInput,
      editingId: number | null,
    ): Promise<boolean> => {
      setIsSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      try {
        if (editingId === null) {
          await createOrganization(input)
          setSuccessMessage('Organization created.')
        } else {
          await updateOrganization(editingId, input)
          setSuccessMessage('Organization updated.')
        }
        await loadOrganizations()
        return true
      } catch (error) {
        setErrorMessage(getErrorMessage(error, saveErrorMessage))
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [loadOrganizations],
  )

  const changeStatus = useCallback(
    async (organizationId: number, status: OrganizationStatus) => {
      if (status === 'DELETED') {
        return
      }

      setErrorMessage('')
      setSuccessMessage('')

      try {
        await updateOrganizationStatus(organizationId, status)
        setSuccessMessage('Organization status updated.')
        await loadOrganizations()
      } catch (error) {
        setErrorMessage(getErrorMessage(error, statusErrorMessage))
      }
    },
    [loadOrganizations],
  )

  const remove = useCallback(
    async (organizationId: number) => {
      setErrorMessage('')
      setSuccessMessage('')

      try {
        await deleteOrganization(organizationId)
        setOrganizations((currentOrganizations) =>
          currentOrganizations.filter(
            (organization) => organization.id !== organizationId,
          ),
        )
        setSuccessMessage('Organization deleted.')
      } catch (error) {
        setErrorMessage(getErrorMessage(error, deleteErrorMessage))
      }
    },
    [],
  )

  return {
    organizations,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    loadOrganizations,
    save,
    changeStatus,
    remove,
  }
}
