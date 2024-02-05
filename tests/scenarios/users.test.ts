/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request';
import { expectGqlToFail, gqlRequest, login, scenario } from '../test_utils';

scenario('Users', () => {
  test('createUser is not accessible when not authenticated', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
            user {
              id
              email
              name
            }
          }
        }
      `,
      variables: { email: 'foo@example.com', name: 'Foo', password: 'bar' },
    });
    expect(errors.map((e) => e.message)).toContain('Not authorized');
  });

  test('updateUser is not accessible when not authenticated', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation UpdateUserName($id: ID!, $name: String!) {
          updateUser(input: { id: $id, name: $name }) {
            user {
              id
              email
              name
            }
          }
        }
      `,
      variables: { id: 'foo', name: 'Cindy' },
    });
    expect(errors.map((e) => e.message)).toContain('Not authorized');
  });

  test('deleteUser is not accessible when not authenticated', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation DeleteUser($id: ID!) {
          deleteUser(input: { id: $id }) {
            clientMutationId
          }
        }
      `,
      variables: { id: 'foo' },
    });
    expect(errors.map((e) => e.message)).toContain('Not authorized');
  });

  test('users is not accessible when not authenticated', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        {
          users {
            id
            email
            name
          }
        }
      `,
    });
    expect(errors.map((e) => e.message)).toContain('Not authorized');
  });

  login('joe');

  const userIds = new Map<string, string>();
  test('users returns all known users', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            id
            email
            name
          }
        }
      `,
    });
    const expected = [
      {
        email: 'linda@example.com',
        name: 'Linda',
      },
      {
        email: 'joe@example.com',
        name: 'Joe',
      },
    ];
    expect(result.users).toHaveLength(expected.length);
    for (const expectedUser of expected) {
      const actualUser = result.users.find((u: { email: string }) => u.email === expectedUser.email);
      expect(actualUser).not.toBeNull();
      expect(actualUser.id).toMatch(/\w+/);
      expect(actualUser.name).toEqual(expectedUser.name);
      userIds.set(actualUser.email, actualUser.id);
    }
  });

  test('add user Sylvia', async () => {
    const result = await gqlRequest({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
            user {
              id
              email
              name
            }
          }
        }
      `,
      variables: {
        email: 'sylvia@example.com',
        name: 'Sylvia',
        password: 'sylvia',
      },
    });
    const sylvia_id = result.createUser.user.id;
    expect(sylvia_id).toMatch(/\w+/);
    userIds.set('sylvia@example.com', sylvia_id);
    expect(result.createUser).toMatchObject({
      user: {
        id: sylvia_id, // given by the server
        email: 'sylvia@example.com',
        name: 'Sylvia',
      },
    });
  });

  test('users now returns Sylvia as well', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            id
            email
            name
          }
        }
      `,
    });
    expect(result.users).toMatchObject([
      {
        id: userIds.get('joe@example.com'),
        email: 'joe@example.com',
        name: 'Joe',
      },
      {
        id: userIds.get('linda@example.com'),
        email: 'linda@example.com',
        name: 'Linda',
      },
      {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'Sylvia',
      },
    ]);
  });

  test('trying to add sylvia@example.com again fails', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
            clientMutationId
          }
        }
      `,
      variables: { email: 'sylvia@example.com', name: 'Sylvia', password: 'sylvia' },
    });
    expect(errors.map((e) => e.message)).toContain('Email has already been taken');
  });

  test("delete an ID that doesn't exist fails", async () => {
    const nonExistingId = '7aba5479-a131-4736-b061-b1bac7f608e2';
    expect(userIds.values()).not.toContain(nonExistingId);
    const errors = await expectGqlToFail({
      query: gql`
        mutation DeleteUser($id: ID!) {
          deleteUser(input: { id: $id }) {
            clientMutationId
          }
        }
      `,
      variables: { id: nonExistingId },
    });
    expect(errors.map((e) => e.message)).toContain('User not found');
  });

  test('delete Linda succeeds', async () => {
    const result = await gqlRequest({
      query: gql`
        mutation DeleteUser($id: ID!) {
          deleteUser(input: { id: $id }) {
            clientMutationId
          }
        }
      `,
      variables: { id: userIds.get('linda@example.com') },
    });
    expect(result.deleteUser).not.toBeFalsy();
  });

  test('users no longer returns Linda', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            id
            email
            name
          }
        }
      `,
    });
    expect(result.users).toMatchObject([
      {
        id: userIds.get('joe@example.com'),
        email: 'joe@example.com',
        name: 'Joe',
      },
      {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'Sylvia',
      },
    ]);
  });

  test("update Linda's name fails because she does not exist", async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation UpdateUserName($id: ID!, $name: String!) {
          updateUser(input: { id: $id, name: $name }) {
            user {
              id
              email
              name
            }
          }
        }
      `,
      variables: { id: userIds.get('linda@example.com'), name: 'Cindy' },
    });
    expect(errors.map((e) => e.message)).toContain('User not found');
  });

  test("update Sylvia's name", async () => {
    const result = await gqlRequest({
      query: gql`
        mutation UpdateUserName($id: ID!, $name: String!) {
          updateUser(input: { id: $id, name: $name }) {
            user {
              id
              email
              name
            }
          }
        }
      `,
      variables: { id: userIds.get('sylvia@example.com'), name: 'ヒトミ, ひとみ' },
    });
    expect(result.updateUser).toMatchObject({
      user: {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'ヒトミ, ひとみ',
      },
    });
  });
});

// TODO: Make sure not providing a field is not nullifying the others.
// TODO: Make sure it's possible to nullify a field.
