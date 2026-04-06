import { GraphQLError } from 'graphql'
import { maskError } from 'graphql-yoga'

interface AdonisError {
  code: string
  messages?: Array<{ field: string; message: string }>
}

function isAdonisError(error: unknown): error is AdonisError {
  return typeof error === 'object' && error !== null && 'code' in error
}

export function formatError(error: unknown, message: string, isDev: boolean): GraphQLError {
  const original = error instanceof GraphQLError ? error.originalError : error

  if (isAdonisError(original)) {
    if (original.code === 'E_VALIDATION_ERROR') {
      const fields = Object.fromEntries(
        (original.messages ?? []).map(({ field, message: msg }) => [field, msg])
      )
      return new GraphQLError('Validation failed', {
        extensions: { code: 'VALIDATION_ERROR', fields },
      })
    }

    if (original.code === 'E_INVALID_CREDENTIALS') {
      return new GraphQLError('Invalid email or password', {
        extensions: { code: 'INVALID_CREDENTIALS' },
      })
    }
  }

  return maskError(error, message, isDev) as GraphQLError
}
