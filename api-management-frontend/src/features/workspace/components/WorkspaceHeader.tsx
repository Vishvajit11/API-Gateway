import { Brand } from '../../../components/Brand'

type WorkspaceHeaderProps = {
  username: string
  roleLabel: string
  onSignOut: () => void
}

export function WorkspaceHeader({
  username,
  roleLabel,
  onSignOut,
}: WorkspaceHeaderProps) {
  return (
    <header className="topBar">
      <Brand />
      <div className="accountArea">
        <div className="accountDetails">
          <span className="accountName">{username}</span>
          <span className="accountRole">{roleLabel}</span>
        </div>
        <button className="secondaryButton" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
