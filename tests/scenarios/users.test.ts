import { gql } from 'graphql-request';
import { expectGqlToFail, gqlRequest, login, scenario } from '../test_utils';

scenario('Users', () => {
  // TODO: Before login in, ensuring that the mutations are not accessible
  test('createUser is not accessible', async () => {
    const errors = await expectGqlToFail({
      query: MUTATION_CREATE_USER,
      variables: { email: 'foo@example.com', name: 'Foo', password: 'bar' },
      expectedMessages: [], //['Not authorized'],
    });
    expect(errors.map((e) => e.message)).toContain('Not authorized');
  });

  login('joe');

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
    }
  });

  let sylvia_id: string;
  test('add user Sylvia', async () => {
    const result = await gqlRequest({
      variables: {
        email: 'sylvia@example.com',
        name: 'Sylvia',
        password: 'sylvia',
      },
      query: MUTATION_CREATE_USER,
    });
    console.log('result', result);
    sylvia_id = result.createUser.user.id;
    expect(sylvia_id).toMatch(/^\w+/);
    expect(result.createUser).toMatchObject({
      user: {
        id: sylvia_id, // given by the server
        email: 'sylvia@example.com',
        name: 'Sylvia',
      },
    });
  });

  // test("users now returns Sylvia as well", async () => {
  //   const result = await gqlRequest(
  //     gql`
  //       {
  //         users {
  //           id
  //           email
  //           name
  //         }
  //       }
  //     `
  //   );
  //   const expected = [
  //     {
  //       id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522",
  //       email: "linda@example.com",
  //       name: "Linda",
  //     },
  //     {
  //       id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
  //       email: "joe@example.com",
  //       name: "Joe",
  //     },
  //     {
  //       id: sylvia_id,
  //       email: "sylvia@example.com",
  //       name: "Sylvia",
  //     },
  //   ];
  //   expect(result.users.length).to.eql(expected.length);
  //   for (let expectedUser of expected) {
  //     expect(result.users.find((u) => u.id === expectedUser.id)).to.eql(
  //       expectedUser
  //     );
  //   }
  // });

  // test("trying to add sylvia@example.com again fails", async () => {
  //   await expectGqlToFail(
  //     gql`
  //       mutation {
  //         createUser(
  //           input: {
  //             email: "sylvia@example.com"
  //             name: "Sylvia"
  //             password: "sylvia"
  //           }
  //         ) {
  //           clientMutationId
  //         }
  //       }
  //     `,
  //     "Email has already been taken"
  //   );
  // });

  // test("delete an ID that doesn't exist fails", async () => {
  //   await expectGqlToFail(
  //     gql`
  //       mutation {
  //         deleteUser(input: { id: "7aba5479-a131-4736-b061-b1bac7f608e2" }) {
  //           clientMutationId
  //         }
  //       }
  //     `,
  //     "no user found with ID 7aba5479-a131-4736-b061-b1bac7f608e2"
  //   );
  // });

  // test("delete Linda succeeds", async () => {
  //   const result = await gqlRequest(
  //     gql`
  //       mutation {
  //         deleteUser(input: { id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522" }) {
  //           user {
  //             id
  //             name
  //             email
  //           }
  //         }
  //       }
  //     `
  //   );
  //   expect(result.deleteUser.user).to.eql({
  //     id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522",
  //     name: "Linda",
  //     email: "linda@example.com",
  //   });
  // });

  // test("users no longer returns Linda", async () => {
  //   const result = await gqlRequest(
  //     gql`
  //       {
  //         users {
  //           id
  //           email
  //           name
  //         }
  //       }
  //     `
  //   );
  //   const expected = [
  //     {
  //       id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
  //       email: "joe@example.com",
  //       name: "Joe",
  //     },
  //     {
  //       id: sylvia_id,
  //       email: "sylvia@example.com",
  //       name: "Sylvia",
  //     },
  //   ];
  //   expect(result.users.length).to.eql(expected.length);
  //   for (let expectedUser of expected) {
  //     expect(result.users.find((u) => u.id === expectedUser.id)).to.eql(
  //       expectedUser
  //     );
  //   }
  // });
});

const MUTATION_CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!) {
    createUser(input: { email: $email, name: $name, password: $password }) {
      user {
        id
        email
        name
      }
    }
  }
`;
