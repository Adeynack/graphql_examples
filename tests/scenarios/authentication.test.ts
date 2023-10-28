/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request';
import { expectGqlToFail, getToken, gqlRequest, scenario, setToken } from '../test_utils';

scenario('Authentication', () => {
  test('me is null before first login', async () => {
    const result = await gqlRequest({
      query: gql`
        query {
          me {
            id
            name
            email
          }
        }
      `,
    });
    expect(result.me).toBe(null);
  });

  let joeId: string;
  test('login succeeds with valid credentials', async () => {
    const result = await gqlRequest({
      variables: { email: 'joe@example.com', password: 'joe' },
      query: gql`
        mutation ($email: String!, $password: String!) {
          logIn(input: { email: $email, password: $password }) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `,
    });
    expect(result.logIn.token).not.toBe(null);
    setToken(result.logIn.token);

    joeId = result.logIn.user.id;
    expect(result.logIn.user).toMatchObject({
      email: 'joe@example.com',
      id: joeId,
      name: 'Joe',
    });
  });

  test('login while already logged in does not create a new token', async () => {
    const result = await gqlRequest({
      variables: { email: 'joe@example.com', password: 'joe' },
      query: gql`
        mutation ($email: String!, $password: String!) {
          logIn(input: { email: $email, password: $password }) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `,
    });
    expect(result.logIn.token).toEqual(getToken());
  });

  test('me is set to the user who just logged in', async () => {
    const result = await gqlRequest({
      query: gql`
        query {
          me {
            id
            name
            email
          }
        }
      `,
    });
    expect(result.me).toMatchObject({
      id: joeId,
      name: 'Joe',
      email: 'joe@example.com',
    });
  });

  test('logout succeeds', async () => {
    const result = await gqlRequest({
      query: gql`
        mutation {
          logOut(input: { clientMutationId: "foo" }) {
            clientMutationId
          }
        }
      `,
    });
    expect(result.logOut.clientMutationId).toBe('foo');
  });

  test('request with invalidated token fails with 401 and a JSON error', async () => {
    let error: any = null;
    try {
      await gqlRequest({
        query: gql`
          {
            me {
              id
            }
          }
        `,
      });
    } catch (e) {
      error = e;
    }
    expect(error).not.toBe(null);
    if (!error) return;
    expect(error.response.status).toBe(401);
    expect(error.response.status).toBe(401);
    expect(error.response.title).toBe('Invalid bearer token');

    setToken(null);
  });

  test('me is null after logout', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          me {
            id
          }
        }
      `,
    });
    expect(result).toHaveProperty('me');
    expect(result.me).toBe(null);
  });

  test('login fails if user email does not exist', async () => {
    await expectGqlToFail({
      query: gql`
        mutation {
          logIn(input: { email: "foo@bar.com", password: "joe" }) {
            user {
              id
            }
          }
        }
      `,
      // Of course, in a production system, you would simply say that the user/pass combination is invalid;
      // but here, we want to test that it failed for the right reason, hence the security-breach-y approach.
      expectedMessages: ['User not found'],
    });
  });

  test('login returns null if user password does not match', async () => {
    await expectGqlToFail({
      query: gql`
        mutation {
          logIn(input: { email: "joe@example.com", password: "foobar" }) {
            user {
              id
            }
          }
        }
      `,
      // Of course, in a production system, you would simply say that the user/pass combination is invalid;
      // but here, we want to test that it failed for the right reason, hence the security-breach-y approach.
      expectedMessages: ['Incorrect password'],
    });
  });
});
