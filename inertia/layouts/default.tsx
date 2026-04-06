import { createEffect, type JSX } from 'solid-js'
import { Link, usePage, router } from 'inertia-adapter-solid'
import { Toaster, toast } from 'solid-sonner'
import { createMutation } from '@urql/solid'
import type { Data } from '@generated/data'
import { urlFor } from '~/client'
import { LOGOUT_MUTATION } from '~/graphql/operations'

export default function Layout(props: { children: JSX.Element }) {
  const page = usePage<Data.SharedProps>()
  const [, logout] = createMutation(LOGOUT_MUTATION)

  createEffect(() => {
    page.url
    toast.dismiss()
  })

  createEffect(() => {
    const flash = page.props.flash
    if (flash?.error) toast.error(flash.error)
    if (flash?.success) toast.success(flash.success)
  })

  async function handleLogout(e: Event) {
    e.preventDefault()
    await logout({})
    router.visit(urlFor('session.create'))
  }

  return (
    <>
      <header>
        <div>
          <div>
            <Link href={urlFor('home')}>
              <svg
                width="66"
                height="24"
                viewBox="0 0 105 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0h7.5v15H0ZM7.5 15h7.5v15H7.5ZM15 30h7.5v7.5H15ZM22.5 15h7.5v15H22.5ZM30 0h7.5v15H30ZM45 0h7.5v30h15v-30h7.5v37.5h-30v-37.5ZM82.5 37.5V0H105v7.5H90V15h15v7.5H90V30h15v7.5H82.5Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
          <div>
            <nav>
              {page.props.user ? (
                <>
                  <span>{page.props.user.initials}</span>
                  <form onSubmit={handleLogout}>
                    <button type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href={urlFor('new_account.create')}>Signup</Link>
                  <Link href={urlFor('session.create')}>Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>{props.children}</main>

      <Toaster position="top-center" richColors />
    </>
  )
}
