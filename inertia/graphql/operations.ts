import { gql } from '@urql/core'

// ── Shared types ────────────────────────────────────────────────────────────

export interface GqlUser {
  id: string
  fullName: string | null
  email: string
  initials: string
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface LoginVariables {
  email: string
  password: string
}

export interface LoginData {
  login: { user: GqlUser }
}

export const LOGIN_MUTATION = gql<LoginData, LoginVariables>`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        fullName
        email
        initials
      }
    }
  }
`

export interface SignupVariables {
  fullName?: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export interface SignupData {
  signup: { user: GqlUser }
}

export const SIGNUP_MUTATION = gql<SignupData, SignupVariables>`
  mutation Signup(
    $fullName: String
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    signup(
      fullName: $fullName
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      user {
        id
        fullName
        email
        initials
      }
    }
  }
`

export interface LogoutData {
  logout: boolean
}

export const LOGOUT_MUTATION = gql<LogoutData, Record<never, never>>`
  mutation Logout {
    logout
  }
`

// ── User ────────────────────────────────────────────────────────────────────

export interface MeData {
  me: GqlUser | null
}

export const ME_QUERY = gql<MeData, Record<never, never>>`
  query Me {
    me {
      id
      fullName
      email
      initials
    }
  }
`
