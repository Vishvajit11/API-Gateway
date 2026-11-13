import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  createTenantAdmin,
  deleteTenantAdmin,
  getTenantAdmin,
  updateTenantAdmin,
  type TenantAdmin,
  type TenantAdminInput,
} from '../services/organizationService'

const loadErrorMessage = 'Unable to load the tenant administrator.'
const saveErrorMessage = 'Unable to save the tenant administrator.'
const deleteErrorMessage = 'Unable to delete the tenant administrator.'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

export function useTenantAdmin(organizationId: number) {
  const [tenantAdmin, setTenantAdmin] = useState<TenantAdmin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const loadTenantAdmin = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      setTenantAdmin(await getTenantAdmin(organizationId))
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setTenantAdmin(null)
        setErrorMessage('')
      } else {
        setErrorMessage(getErrorMessage(error, loadErrorMessage))
      }
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    void loadTenantAdmin()
  }, [loadTenantAdmin])

  const save = useCallback(
    async (input: TenantAdminInput): Promise<boolean> => {
      setIsSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      try {
        const savedAdmin = tenantAdmin
          ? await updateTenantAdmin(organizationId, input)
          : await createTenantAdmin(organizationId, input)
        setTenantAdmin(savedAdmin)
        setSuccessMessage(
          tenantAdmin
            ? 'Tenant administrator updated.'
            : 'Tenant administrator created.',
        )
        return true
      } catch (error) {
        setErrorMessage(getErrorMessage(error, saveErrorMessage))
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [organizationId, tenantAdmin],
  )

  const remove = useCallback(async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await deleteTenantAdmin(organizationId)
      setTenantAdmin(null)
      setSuccessMessage('Tenant administrator deleted.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, deleteErrorMessage))
    } finally {
      setIsSaving(false)
    }
  }, [organizationId])

  return {
    tenantAdmin,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
    loadTenantAdmin,
    save,
    remove,
  }
}
