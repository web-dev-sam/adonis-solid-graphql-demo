# GraphQL Guide

This project uses [graphql-yoga](https://the-guild.dev/graphql/yoga-server) on the backend and [@urql/solid](https://urql.dev) on the frontend.

The endpoint lives at `/graphql`. In development, GraphiQL (the interactive explorer) is available at the same URL in the browser.

---

## Project structure

```
app/
  graphql/
    schema.ts          ← SDL type definitions (what the API looks like)
    context.ts         ← types for what is available inside every resolver
    errors.ts          ← translates Adonis errors to GraphQL errors (edit once, covers all endpoints)
    resolvers/
      index.ts         ← merges all resolvers together
      auth.ts          ← thin adapter: unpacks args, calls a service, returns result
      user.ts          ← thin adapter: same idea
  services/
    auth_service.ts    ← actual business logic lives here, not in resolvers
  controllers/
    graphql_controller.ts  ← HTTP adapter for the /graphql route (do not touch)

inertia/
  graphql/
    client.ts          ← URQL client setup (do not touch)
    operations.ts      ← all frontend queries and mutations live here
```

**The rule:** resolvers are thin. Business logic belongs in services.

---

## Adding a new query

Say you want a `posts` query that returns a list of posts.

### 1. Add the type and query to the schema

`app/graphql/schema.ts`

```graphql
type Post {
  id: ID!
  title: String!
  body: String!
  createdAt: String!
}

type Query {
  me: User
  posts: [Post!]!   # ← add this
}
```

### 2. Create a service

`app/services/post_service.ts`

```typescript
import Post from '#models/post'

export default class PostService {
  async list() {
    return Post.all()
  }
}
```

### 3. Create a resolver

`app/graphql/resolvers/post.ts`

```typescript
import PostService from '#services/post_service'

const postService = new PostService()

export const postResolvers = {
  Query: {
    async posts() {
      return postService.list()
    },
  },
}
```

### 4. Register the resolver

`app/graphql/resolvers/index.ts`

```typescript
import { postResolvers } from './post.js'

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,   // ← add this
  },
  Mutation: { ... },
}
```

### 5. Add the frontend operation

`inertia/graphql/operations.ts`

```typescript
export interface PostsData {
  posts: Array<{ id: string; title: string; body: string; createdAt: string }>
}

export const POSTS_QUERY = gql<PostsData, Record<never, never>>`
  query Posts {
    posts {
      id
      title
      body
      createdAt
    }
  }
`
```

### 6. Use it in a page

```typescript
import { createQuery } from '@urql/solid'
import { POSTS_QUERY } from '~/graphql/operations'

export default function PostsPage() {
  const [result] = createQuery({ query: POSTS_QUERY })

  return (
    <Show when={result.data}>
      <For each={result.data!.posts}>
        {(post) => <div>{post.title}</div>}
      </For>
    </Show>
  )
}
```

---

## Adding a new mutation

Same steps as a query, but:

- Add the mutation to `Mutation` in the schema (not `Query`)
- Add the resolver under `Mutation` in your resolver file and in `index.ts`
- Use `createMutation` instead of `createQuery` on the frontend

If the mutation needs the current user's session (auth, logout, etc.), pull `httpContext` from the GraphQL context:

```typescript
// resolver
async createPost(_: unknown, args: CreatePostArgs, { httpContext }: GraphQLContext) {
  return postService.create(args, httpContext.auth)
}

// service
async create(input: CreatePostInput, auth: HttpContext['auth']) {
  const user = auth.use('web').user!
  return Post.create({ ...input, userId: user.id })
}
```

---

## Protecting an endpoint (auth required)

Check `currentUser` in the resolver and throw if it is null:

```typescript
import { createGraphQLError } from 'graphql-yoga'

async myProtectedQuery(_: unknown, _args: unknown, { currentUser }: GraphQLContext) {
  if (!currentUser) {
    throw createGraphQLError('Unauthenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
  // ...
}
```

---

## Error handling

You do **not** need to catch errors inside services or resolvers for the common cases. The global error formatter in `app/graphql/errors.ts` handles them automatically:

| Thrown by | Error code | What the client receives |
|---|---|---|
| VineJS validator | `E_VALIDATION_ERROR` | `{ code: 'VALIDATION_ERROR', fields: { email: '...' } }` |
| Lucid auth | `E_INVALID_CREDENTIALS` | `{ code: 'INVALID_CREDENTIALS' }` |
| Anything else | — | Masked in production, full error in development |

To add a new translated error, add a new `if` block in `app/graphql/errors.ts`. It will cover every endpoint automatically.

---

## Reading errors on the frontend

```typescript
const [result, execute] = createMutation(MY_MUTATION)

const { error } = await execute(variables)

if (error) {
  const gqlError = error.graphQLErrors[0]

  // Field-level validation errors
  if (gqlError?.extensions?.['code'] === 'VALIDATION_ERROR') {
    const fields = gqlError.extensions['fields'] as Record<string, string>
    // fields.email, fields.password, etc.
  }

  // Generic error message
  console.error(gqlError?.message)
}
```
