import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../api/apiClient'
import { signIn as signInWithCredentials } from '../services/authService'
import {
  clearSession,
  getSavedSession,
  type AuthSession,
} from '../services/sessionStore'

const sessionExpiredMessage = 'Your session has expired. Please sign in again.'
const signInErrorMessage =
  'Unable to reach the API management service. Please try again.'

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(getSavedSession)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    function handleSessionExpired() {
      setSession(null)
      setErrorMessage(sessionExpiredMessage)
    }

    window.addEventListener('sessionExpired', handleSessionExpired)
    return () =>
      window.removeEventListener('sessionExpired', handleSessionExpired)
  }, [])

  useEffect(() => {
    if (!session) {
      return
    }

    const remainingTime = session.expiresAt - Date.now()
    if (remainingTime <= 0) {
      clearSession()
      setSession(null)
      setErrorMessage(sessionExpiredMessage)
      return
    }

    const expiryTimer = window.setTimeout(() => {
      clearSession()
      setSession(null)
      setErrorMessage(sessionExpiredMessage)
    }, remainingTime)

    return () => window.clearTimeout(expiryTimer)
  }, [session])

  const signIn = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setErrorMessage('')
      setIsSubmitting(true)

      try {
        setSession(await signInWithCredentials({ username, password }))
        return true
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError ? error.message : signInErrorMessage,
        )
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [],
  )

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
    setErrorMessage('')
  }, [])

  return { session, errorMessage, isSubmitting, signIn, signOut }
}
