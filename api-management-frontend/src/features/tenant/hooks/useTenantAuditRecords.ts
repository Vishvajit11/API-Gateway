import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import {
  getTenantAuditRecords,
  type AuditRecord,
} from '../services/tenantService'

export function useTenantAuditRecords() {
  const [records, setRecords] = useState<AuditRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadRecords = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      setRecords(await getTenantAuditRecords())
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Unable to load audit records.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRecords()
  }, [loadRecords])

  return { records, isLoading, errorMessage, loadRecords }
}
