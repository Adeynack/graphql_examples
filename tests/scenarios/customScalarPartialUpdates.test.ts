import { gql } from 'graphql-request';
import { expectGqlToFail, gqlRequest, login, scenario } from '../test_utils';
import { NoUnusedVariablesRule } from 'graphql';

scenario('Custom Scalar, Nullable Values & Partial Update', () => {
  const userIds = new Map<string, string>();

  login('joe');

  test('create user sylvia with birth date', async () => {
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
        birthDate: '2004-06-07T00:00:00Z',
      },
    });
  });

  test('users returns birth dates, including those already in the database', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            email
            birthDate
          }
        }
      `,
    });
    expect(result.users).toMatchObject([
      {
        email: 'joe@example.com',
        birthDate: '1990-03-06T01:23:45Z',
      },
      {
        email: 'linda@example.com',
        birthDate: null,
      },
      {
        email: 'sylvia@example.com',
        birthDate: '2004-06-07T00:00:00Z',
      },
    ]);
  });

  test("updating Sylvia's name does not nullify birth date", async () => {
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
        name: 'ヒトミ, ひとみ', // changed
        birthDate: '2004-06-07T00:00:00Z', // unchanged
      },
    });
  });

  test("update Sylvia's birth date", async () => {
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

  test('create user Simon without specifying a birthdate', async () => {
    const result = await gqlRequest({
      query: gql`
        mutation CreateUser($email: String!, $name: String!, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
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
        email: 'simon@example.com',
        name: 'Simon',
        password: 'Salmonela',
      },
    });
    const simon_id = result.createUser.user.id;
    expect(simon_id).toMatch(/\w+/);
    userIds.set('simon@example.com', simon_id);
    expect(result.createUser).toMatchObject({
      user: {
        id: simon_id, // given by the server
        email: 'simon@example.com',
        name: 'Simon',
        birthDate: null, // expecting this to be its default 'null'
      },
    });
  });

  test("users returns birth dates, including Simon's null", async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            email
            birthDate
          }
        }
      `,
    });
    expect(result.users).toMatchObject([
      {
        email: 'joe@example.com',
        birthDate: '1990-03-06T01:23:45Z',
      },
      {
        email: 'linda@example.com',
        birthDate: null,
      },
      {
        email: 'simon@example.com',
        birthDate: null,
      },
      {
        email: 'sylvia@example.com',
        birthDate: null,
      },
    ]);
  });
});
