import { requestApi } from '../../../api/apiClient'
import {
  saveSession,
  type AuthSession,
  type LoginResponse,
} from './sessionStore'

type Credentials = {
  username: string
  password: string
}

export async function signIn(credentials: Credentials): Promise<AuthSession> {
  const loginResponse = await requestApi<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  return saveSession(loginResponse, credentials.username)
}
