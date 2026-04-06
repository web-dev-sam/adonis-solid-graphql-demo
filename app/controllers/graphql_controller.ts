import type { HttpContext } from '@adonisjs/core/http'
import { createYoga, createSchema } from 'graphql-yoga'
import { typeDefs } from '#graphql/schema'
import { resolvers } from '#graphql/resolvers/index'
import { formatError } from '#graphql/errors'
import type { GraphQLContext } from '#graphql/context'

const yoga = createYoga<{ httpContext: HttpContext }, GraphQLContext>({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: '/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
  maskedErrors: { maskError: formatError },
  context: async ({ httpContext }) => {
    let currentUser = null
    try {
      const authenticated = await httpContext.auth.use('web').check()
      if (authenticated) {
        currentUser = httpContext.auth.use('web').user ?? null
      }
    } catch {}
    return { httpContext, currentUser }
  },
})

export default class GraphqlController {
  async handle(ctx: HttpContext) {
    const { request, response } = ctx

    const host = request.header('host') ?? 'localhost'
    const proto = request.header('x-forwarded-proto') ?? 'http'
    const url = `${proto}://${host}${request.url()}`

    const headers = new Headers()
    for (const [key, value] of Object.entries(request.headers())) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v)
        } else {
          headers.set(key, value)
        }
      }
    }

    const isGetOrHead = ['GET', 'HEAD'].includes(request.method())
    const fetchRequest = new Request(url, {
      method: request.method(),
      headers,
      body: isGetOrHead ? undefined : JSON.stringify(request.body()),
    })

    const yogaResponse = await yoga.handleRequest(fetchRequest, { httpContext: ctx })

    response.status(yogaResponse.status)
    yogaResponse.headers.forEach((value: string, key: string) => {
      response.header(key, value)
    })

    return response.send(await yogaResponse.text())
  }
}
