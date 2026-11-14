import { useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  getTenantRouteById,
  type TenantRoute,
} from '../services/tenantService'

export function useTenantRouteLookup() {
  const [route, setRoute] = useState<TenantRoute | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function findRoute(routePk: number): Promise<void> {
    setIsLoading(true)
    setErrorMessage('')
    setRoute(null)

    try {
      setRoute(await getTenantRouteById(routePk))
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to find the route.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { route, isLoading, errorMessage, findRoute }
}
