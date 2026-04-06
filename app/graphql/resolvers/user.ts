import type { GraphQLContext } from '#graphql/context'

export const userResolvers = {
  Query: {
    me(_: unknown, _args: unknown, { currentUser }: GraphQLContext) {
      return currentUser
    },
  },
}
