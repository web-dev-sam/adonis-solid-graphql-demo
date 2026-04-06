import { createSignal } from 'solid-js'
import { router } from 'inertia-adapter-solid'
import { createMutation } from '@urql/solid'
import { urlFor } from '~/client'
import { SIGNUP_MUTATION } from '~/graphql/operations'
import Layout from '~/layouts/default'

export default function Signup() {
  const [fullName, setFullName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [passwordConfirmation, setPasswordConfirmation] = createSignal('')
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({})

  const [result, signup] = createMutation(SIGNUP_MUTATION)

  async function handleSubmit(e: Event) {
    e.preventDefault()
    setFieldErrors({})

    const { error } = await signup({
      fullName: fullName() || null,
      email: email(),
      password: password(),
      passwordConfirmation: passwordConfirmation(),
    })

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
        <h1>Signup</h1>
        <p>Enter your details below to create your account</p>
      </div>

      <div>
        <form onSubmit={handleSubmit}>
          {result.error && !result.error.graphQLErrors[0]?.extensions?.['fields'] && (
            <div>{result.error.graphQLErrors[0]?.message ?? 'An error occurred'}</div>
          )}

          <div>
            <label for="fullName">Full name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName()}
              onInput={(e) => setFullName(e.currentTarget.value)}
              data-invalid={fieldErrors().fullName ? 'true' : undefined}
            />
            {fieldErrors().fullName && <div>{fieldErrors().fullName}</div>}
          </div>

          <div>
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autocomplete="email"
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
              autocomplete="new-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              data-invalid={fieldErrors().password ? 'true' : undefined}
            />
            {fieldErrors().password && <div>{fieldErrors().password}</div>}
          </div>

          <div>
            <label for="passwordConfirmation">Confirm password</label>
            <input
              type="password"
              name="passwordConfirmation"
              id="passwordConfirmation"
              autocomplete="new-password"
              value={passwordConfirmation()}
              onInput={(e) => setPasswordConfirmation(e.currentTarget.value)}
              data-invalid={fieldErrors().passwordConfirmation ? 'true' : undefined}
            />
            {fieldErrors().passwordConfirmation && (
              <div>{fieldErrors().passwordConfirmation}</div>
            )}
          </div>

          <div>
            <button type="submit" class="button" disabled={result.fetching}>
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

Signup.layout = Layout
