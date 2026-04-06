import { createInertiaApp } from 'inertia-adapter-solid'
import createServer from 'inertia-adapter-solid/server'

export default createServer((page) =>
  createInertiaApp({
    page,
    resolve(name) {
      const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
      return pages[`./pages/${name}.tsx`]
    },
  })
)
