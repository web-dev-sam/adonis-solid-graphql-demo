/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
  }
  session: {
    create: typeof routes['session.create']
  }
  graphql: typeof routes['graphql']
}
