import { useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  getOrganizationById,
  type Organization,
} from '../services/organizationService'

export function useOrganizationLookup() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function findOrganization(id: number): Promise<void> {
    setIsLoading(true)
    setErrorMessage('')
    setOrganization(null)

    try {
      setOrganization(await getOrganizationById(id))
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to find the organization.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { organization, isLoading, errorMessage, findOrganization }
}
