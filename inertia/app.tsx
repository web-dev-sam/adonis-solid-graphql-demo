import './css/app.css'
import { render } from 'solid-js/web'
import { createInertiaApp } from 'inertia-adapter-solid'
import { Provider } from '@urql/solid'
import { graphqlClient } from '~/graphql/client'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })
    return pages[`./pages/${name}.tsx`]
  },
  setup({ el, App, props }) {
    render(
      () => (
        <Provider value={graphqlClient}>
          <App {...props} />
        </Provider>
      ),
      el
    )
  },
  progress: {
    color: '#4B5563',
  },
})
