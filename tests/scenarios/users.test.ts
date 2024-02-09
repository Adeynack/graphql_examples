/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request';
import { expectGqlToFail, gqlRequest, login, scenario } from '../test_utils';

scenario('Users', () => {
  test('createUser is not accessible when not authenticated', async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!) {
          createUser(
            input: { clientMutationId: "createUser Not Authorized", email: $email, name: $name, password: $password }
          ) {
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
          updateUser(input: { clientMutationId: "updateUser Not Authorized", id: $id, name: $name }) {
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
    expect(result.users).toMatchObject([
      {
        id: expect.stringMatching(/.+/),
        email: 'joe@example.com',
        name: 'Joe',
      },
      {
        id: expect.stringMatching(/.+/),
        email: 'linda@example.com',
        name: 'Linda',
      },
    ]);

    result.users.forEach((u: any) => userIds.set(u.email, u.id));
  });

  test('add user Sylvia', async () => {
    const result = await gqlRequest({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!, $birthDate: ISO8601DateTime) {
          createUser(input: { email: $email, name: $name, password: $password, birthDate: $birthDate }) {
            user {
              id
              email
              name
              birthDate
            }
          }
        }
      `,
      variables: {
        email: 'sylvia@example.com',
        name: 'Sylvia',
        password: 'sylvia',
        birthDate: '2004-06-07T00:00:00Z',
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
            birthDate
          }
        }
      `,
    });
    expect(result.users).toMatchObject([
      {
        id: userIds.get('joe@example.com'),
        email: 'joe@example.com',
        name: 'Joe',
        birthDate: '1990-03-06T01:23:45Z',
      },
      {
        id: userIds.get('linda@example.com'),
        email: 'linda@example.com',
        name: 'Linda',
        birthDate: null,
      },
      {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'Sylvia',
        birthDate: '2004-06-07T00:00:00Z',
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
          updateUser(
            input: { clientMutationId: "update Linda's name fails because she does not exist", id: $id, name: $name }
          ) {
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
          updateUser(input: { clientMutationId: "update Sylvia's name", id: $id, name: $name }) {
            user {
              id
              email
              name
              birthDate
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
        birthDate: '2004-06-07T00:00:00Z',
      },
    });
  });

  test("update Sylvia's birthDate", async () => {
    const result = await gqlRequest({
      query: gql`
        mutation UpdateUserName($id: ID!, $birthDate: ISO8601DateTime) {
          updateUser(input: { clientMutationId: "update Sylvia's birthDate", id: $id, birthDate: $birthDate }) {
            user {
              id
              email
              name
              birthDate
            }
          }
        }
      `,
      variables: { id: userIds.get('sylvia@example.com'), birthDate: '2005-01-01T00:00:00Z' },
    });
    expect(result.updateUser).toMatchObject({
      user: {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'ヒトミ, ひとみ',
        birthDate: '2005-01-01T00:00:00Z',
      },
    });
  });

  test("erase (nullify) Sylvia's birthDate", async () => {
    const result = await gqlRequest({
      query: gql`
        mutation UpdateUserName($id: ID!, $birthDate: ISO8601DateTime) {
          updateUser(
            input: { clientMutationId: "erase (nullify) Sylvia's birthDate", id: $id, birthDate: $birthDate }
          ) {
            user {
              id
              email
              name
              birthDate
            }
          }
        }
      `,
      variables: { id: userIds.get('sylvia@example.com'), birthDate: null },
    });
    expect(result.updateUser).toMatchObject({
      user: {
        id: userIds.get('sylvia@example.com'),
        email: 'sylvia@example.com',
        name: 'ヒトミ, ひとみ',
        birthDate: null,
      },
    });
  });

  test("nullifying Sylvia's name fails", async () => {
    const errors = await expectGqlToFail({
      query: gql`
        mutation UpdateUserName($id: ID!, $name: String) {
          updateUser(input: { clientMutationId: "nullifying Sylvia's name fails", id: $id, name: $name }) {
            clientMutationId
            user {
              id
              email
              name
              birthDate
            }
          }
        }
      `,
      variables: { id: userIds.get('sylvia@example.com'), name: null },
    });
    expect(errors.map((e) => e.message)).toContain('name cannot be null');
  });
});
