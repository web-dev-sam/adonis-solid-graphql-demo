import { createSignal } from 'solid-js'
import { router } from 'inertia-adapter-solid'
import { createMutation } from '@urql/solid'
import { urlFor } from '~/client'
import { LOGIN_MUTATION } from '~/graphql/operations'
import Layout from '~/layouts/default'

export default function Login() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({})

  const [result, login] = createMutation(LOGIN_MUTATION)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setFieldErrors({})

    const { error } = await login({ email: email(), password: password() })

    if (error) {
      const gqlError = error.graphQLErrors[0]
      if (gqlError?.extensions?.['code'] === 'VALIDATION_ERROR') {
        setFieldErrors((gqlError.extensions['fields'] as Record<string, string>) ?? {})
      }
      return
    }

    router.visit(urlFor('home'))
  }

  return (
    <div class="form-container">
      <div>
        <h1>Login</h1>
        <p>Enter your details below to login to your account</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          {result.error && !result.error.graphQLErrors[0]?.extensions?.['fields'] && (
            <div>{result.error.graphQLErrors[0]?.message ?? 'An error occurred'}</div>
          )}

          <div>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="username"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              data-invalid={fieldErrors().email ? 'true' : undefined}
            />
            {fieldErrors().email && <div>{fieldErrors().email}</div>}
          </div>

          <div>
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              data-invalid={fieldErrors().password ? 'true' : undefined}
            />
            {fieldErrors().password && <div>{fieldErrors().password}</div>}
          </div>

          <div>
            <button type="submit" class="button" disabled={result.fetching}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

Login.layout = Layout
