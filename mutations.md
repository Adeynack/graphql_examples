# Mutations

## logIn

Side effects:

- Creates a new `Session` in the database and generates a `token` for it.
- Any further request provider the `Authorization: Bearer {token}` header will be authenticated.

Arguments:

- `email: String!`
- `password: String!`

Fields:

- `token: String!`
- `user: User!`

## logOut

Side effects:

- Deletes the `Session` identified by the `token`.
- Any further request providing this token will **NOT** be authenticated.

## createUser

Arguments:

- `email: String!`
- `name: String!`
- `password: String!`

Fields:

- `user: User!`

## updateUser

Arguments:

- `id: ID!`
- `email: String`
- `name: String`
- `password: String`

Fields:

- `user: User!`

## deleteUser

Arguments:

- `id: ID!`

Fields:

- `user: User!`

## createPost

Arguments:

- `text: String!`
- `parent_id: ID`

Fields:

- `post: Post!`

## deletePost

Arguments:

- `id: ID!`

Fields:

- `post: Post!`

## reactToPost

Arguments:

- `postId: ID!`
- `emotion: Emotion!`

Fields:

- `reaction: Reaction!`

## clearReactionToPost

Arguments:

- `postId: ID!`

Fields:

- `post: Post!`
