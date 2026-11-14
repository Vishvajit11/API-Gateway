import type { AuthSession } from '../../auth/services/sessionStore'
import { WorkspaceHeader } from './WorkspaceHeader'
import { getWorkspaceDetails } from '../workspaceConfig'
import '../workspace.css'

type WorkspacePageProps = {
  session: AuthSession
  onSignOut: () => void
}

export function WorkspacePage({ session, onSignOut }: WorkspacePageProps) {
  const workspace = getWorkspaceDetails(session.role)

  return (
    <main className="appShell">
      <WorkspaceHeader
        onSignOut={onSignOut}
        roleLabel={workspace.label}
        username={session.username}
      />
      <section className="workspaceCard" aria-labelledby="workspaceTitle">
        <p className="eyebrow">{workspace.label}</p>
        <h1 id="workspaceTitle">{workspace.title}</h1>
        <p className="welcomeText">{workspace.description}</p>
        {session.organizationId !== null && (
          <p className="organizationInfo">
            Organization ID <strong>{session.organizationId}</strong>
          </p>
        )}
        <div className="nextStep">
          <span className="statusDot" aria-hidden="true" />
          <span>Signed in and ready to manage your APIs.</span>
        </div>
      </section>
    </main>
  )
}
