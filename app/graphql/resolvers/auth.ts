import AuthService from '#services/auth_service'
import type { SignupInput, LoginInput } from '#services/auth_service'
import type { GraphQLContext } from '#graphql/context'

const authService = new AuthService()

export const authResolvers = {
  Mutation: {
    async signup(_: unknown, args: SignupInput, { httpContext }: GraphQLContext) {
      const user = await authService.signup(args, httpContext.auth)
      return { user }
    },

    async login(_: unknown, args: LoginInput, { httpContext }: GraphQLContext) {
      const user = await authService.login(args, httpContext.auth)
      return { user }
    },

    async logout(_: unknown, _args: unknown, { httpContext }: GraphQLContext) {
      await authService.logout(httpContext.auth)
      return true
    },
  },
}
