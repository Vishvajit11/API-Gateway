import { LoginPage } from '../features/auth/components/LoginPage'
import { useAuthSession } from '../features/auth/hooks/useAuthSession'
import { WorkspacePage } from '../features/workspace/components/WorkspacePage'

export function App() {
  const { session, errorMessage, isSubmitting, signIn, signOut } =
    useAuthSession()

  if (session) {
    return <WorkspacePage session={session} onSignOut={signOut} />
  }

  return (
    <LoginPage
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSignIn={signIn}
    />
  )
}
