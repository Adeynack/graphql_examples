/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from 'graphql-request';
import { expectGqlToFail, gqlRequest, login, scenario } from '../test_utils';

// This scenario has gets users and their messages. It's short in
// order to assert that the example avoids N+1 queries.
//
// There are no automated ways of ensuring no N+1 queries are performed.
// Manual observation is required to make sure it does not.
// This scenario only ensures the data is what is expected.
//
scenario('Users have many Messages', () => {
  test('users list the messages they authored', async () => {
    const result = await gqlRequest({
      query: gql`
        {
          users {
            email
          }
        }
      `,
    });
  });
});
