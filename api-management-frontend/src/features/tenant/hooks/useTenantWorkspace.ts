import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  createTenantRoute,
  deleteTenantRoute,
  getOwnOrganization,
  getTenantRoutes,
  getTenantRouteVersions,
  updateOwnOrganization,
  updateTenantRoute,
  updateTenantRouteStatus,
  type TenantOrganization,
  type TenantRoute,
  type RouteInput,
  type RouteVersion,
} from '../services/tenantService'

const organizationErrorMessage = 'Unable to load your organization.'
const routesErrorMessage = 'Unable to load your API routes.'
const updateErrorMessage = 'Unable to update your organization.'
const saveRouteErrorMessage = 'Unable to save the route.'
const routeActionErrorMessage = 'Unable to update the route.'

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback
}

export function useTenantWorkspace() {
  const [organization, setOrganization] = useState<TenantOrganization | null>(
    null,
  )
  const [routes, setRoutes] = useState<TenantRoute[]>([])
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isSavingOrganization, setIsSavingOrganization] = useState(false)
  const [organizationError, setOrganizationError] = useState('')
  const [routesError, setRoutesError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSavingRoute, setIsSavingRoute] = useState(false)
  const [routeVersions, setRouteVersions] = useState<RouteVersion[]>([])
  const [routeVersionsError, setRouteVersionsError] = useState('')
  const [isLoadingRouteVersions, setIsLoadingRouteVersions] = useState(false)

  const loadOrganization = useCallback(async () => {
    setIsLoadingOrganization(true)
    setOrganizationError('')

    try {
      setOrganization(await getOwnOrganization())
    } catch (error) {
      setOrganizationError(getErrorMessage(error, organizationErrorMessage))
    } finally {
      setIsLoadingOrganization(false)
    }
  }, [])

  const loadRoutes = useCallback(async () => {
    setIsLoadingRoutes(true)
    setRoutesError('')

    try {
      setRoutes(await getTenantRoutes())
    } catch (error) {
      setRoutesError(getErrorMessage(error, routesErrorMessage))
    } finally {
      setIsLoadingRoutes(false)
    }
  }, [])

  useEffect(() => {
    void loadOrganization()
    void loadRoutes()
  }, [loadOrganization, loadRoutes])

  const saveOrganizationName = useCallback(async (name: string) => {
    setIsSavingOrganization(true)
    setOrganizationError('')
    setSuccessMessage('')

    try {
      setOrganization(await updateOwnOrganization(name))
      setSuccessMessage('Organization name updated.')
      return true
    } catch (error) {
      setOrganizationError(getErrorMessage(error, updateErrorMessage))
      return false
    } finally {
      setIsSavingOrganization(false)
    }
  }, [])

  const saveRoute = useCallback(
    async (input: RouteInput, routePk: number | null): Promise<boolean> => {
      setIsSavingRoute(true)
      setRoutesError('')
      setSuccessMessage('')

      try {
        if (routePk === null) {
          await createTenantRoute(input)
          setSuccessMessage('Route created.')
        } else {
          await updateTenantRoute(routePk, input)
          setSuccessMessage('Route updated.')
        }
        await loadRoutes()
        return true
      } catch (error) {
        setRoutesError(getErrorMessage(error, saveRouteErrorMessage))
        return false
      } finally {
        setIsSavingRoute(false)
      }
    },
    [loadRoutes],
  )

  const changeRouteStatus = useCallback(
    async (route: TenantRoute, active: boolean) => {
      setRoutesError('')
      setSuccessMessage('')

      try {
        await updateTenantRouteStatus(route.id, active)
        setSuccessMessage(`Route ${active ? 'activated' : 'deactivated'}.`)
        await loadRoutes()
      } catch (error) {
        setRoutesError(getErrorMessage(error, routeActionErrorMessage))
      }
    },
    [loadRoutes],
  )

  const removeRoute = useCallback(
    async (route: TenantRoute) => {
      setRoutesError('')
      setSuccessMessage('')

      try {
        await deleteTenantRoute(route.id)
        setRoutes((currentRoutes) =>
          currentRoutes.filter((currentRoute) => currentRoute.id !== route.id),
        )
        setSuccessMessage('Route deleted.')
      } catch (error) {
        setRoutesError(getErrorMessage(error, routeActionErrorMessage))
      }
    },
    [],
  )

  const loadRouteVersions = useCallback(async (routeId: string) => {
    setRouteVersions([])
    setRouteVersionsError('')
    setIsLoadingRouteVersions(true)

    try {
      setRouteVersions(await getTenantRouteVersions(routeId))
    } catch (error) {
      setRouteVersionsError(getErrorMessage(error, 'Unable to load route history.'))
    } finally {
      setIsLoadingRouteVersions(false)
    }
  }, [])

  return {
    organization,
    routes,
    isLoadingOrganization,
    isLoadingRoutes,
    isSavingOrganization,
    organizationError,
    routesError,
    successMessage,
    isSavingRoute,
    routeVersions,
    routeVersionsError,
    isLoadingRouteVersions,
    loadOrganization,
    loadRoutes,
    saveOrganizationName,
    saveRoute,
    changeRouteStatus,
    removeRoute,
    loadRouteVersions,
    clearRouteVersions: () => {
      setRouteVersions([])
      setRouteVersionsError('')
      setIsLoadingRouteVersions(false)
    },
  }
}
