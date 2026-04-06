import { authResolvers } from './auth.js'
import { userResolvers } from './user.js'

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
}
