export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    fullName: String
    email: String!
    initials: String!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(
      fullName: String
      email: String!
      password: String!
      passwordConfirmation: String!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    logout: Boolean!
  }
`
