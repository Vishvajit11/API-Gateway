import { useState, type FormEvent } from 'react'
import { Brand } from '../../../components/Brand'
import '../auth.css'

type LoginPageProps = {
  errorMessage: string
  isSubmitting: boolean
  onSignIn: (username: string, password: string) => Promise<boolean>
}

export function LoginPage({
  errorMessage,
  isSubmitting,
  onSignIn,
}: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (await onSignIn(username, password)) {
      setPassword('')
    }
  }

  return (
    <main className="appShell">
      <section className="loginCard" aria-labelledby="pageTitle">
        <div className="loginHeading">
          <Brand showServiceName />
        </div>
        <h1 id="pageTitle">Sign in to your workspace</h1>
        <p className="welcomeText">Use your management account to continue.</p>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="fieldLabel" htmlFor="username">
            Username
          </label>
          <input
            autoComplete="username"
            className="textInput"
            id="username"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
          <label className="fieldLabel" htmlFor="password">
            Password
          </label>
          <input
            autoComplete="current-password"
            className="textInput"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          {errorMessage && (
            <p className="errorMessage" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className="primaryButton"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
