import type { HttpContext } from '@adonisjs/core/http'
import type User from '#models/user'

export interface GraphQLContext {
  httpContext: HttpContext
  currentUser: User | null
}
