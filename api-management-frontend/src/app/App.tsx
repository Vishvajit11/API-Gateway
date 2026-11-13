import { LoginPage } from '../features/auth/components/LoginPage'
import { useAuthSession } from '../features/auth/hooks/useAuthSession'
import { OrganizationsPage } from '../features/organizations/components/OrganizationsPage'
import { WorkspacePage } from '../features/workspace/components/WorkspacePage'

export function App() {
  const { session, errorMessage, isSubmitting, signIn, signOut } =
    useAuthSession()

  if (session) {
    if (session.role === 'PLATFORM_ADMIN') {
      return <OrganizationsPage session={session} onSignOut={signOut} />
    }

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
