import { createClient, cacheExchange, fetchExchange } from '@urql/core'

export const graphqlClient = createClient({
  url: '/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: 'same-origin',
  },
})
