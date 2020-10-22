const expect = require("expect.js");
const { step } = require("mocha-steps");
const {
  scenario,
  gqlRequest,
  login,
  expectAsyncException,
  expectGqlToFail,
} = require("../test_utils");
const { gql } = require("graphql-request");

scenario("Users", () => {
  login("joe");

  step("users returns all known users", async () => {
    const result = await gqlRequest(
      gql`
        {
          users {
            id
            email
            name
          }
        }
      `
    );
    const expected = [
      {
        id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522",
        email: "linda@example.com",
        name: "Linda",
      },
      {
        id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
        email: "joe@example.com",
        name: "Joe",
      },
    ];
    expect(result.users.length).to.eql(expected.length);
    for (let expectedUser of expected) {
      expect(result.users.find((u) => u.id === expectedUser.id)).to.eql(
        expectedUser
      );
    }
  });

  let sylvia_id;
  step("add user Sylvia", async () => {
    const result = await gqlRequest(
      gql`
        mutation {
          createUser(
            input: {
              email: "sylvia@example.com"
              name: "Sylvia"
              password: "sylvia"
            }
          ) {
            user {
              id
              email
              name
            }
          }
        }
      `
    );
    sylvia_id = result.createUser.user.id;
    expect(sylvia_id).not.to.be.empty();
    expect(result.createUser).to.eql({
      user: {
        id: sylvia_id, // given by the server
        email: "sylvia@example.com",
        name: "Sylvia",
      },
    });
  });

  step("users now returns Sylvia as well", async () => {
    const result = await gqlRequest(
      gql`
        {
          users {
            id
            email
            name
          }
        }
      `
    );
    const expected = [
      {
        id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522",
        email: "linda@example.com",
        name: "Linda",
      },
      {
        id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
        email: "joe@example.com",
        name: "Joe",
      },
      {
        id: sylvia_id,
        email: "sylvia@example.com",
        name: "Sylvia",
      },
    ];
    expect(result.users.length).to.eql(expected.length);
    for (let expectedUser of expected) {
      expect(result.users.find((u) => u.id === expectedUser.id)).to.eql(
        expectedUser
      );
    }
  });

  step("trying to add sylvia@example.com again fails", async () => {
    await expectGqlToFail(
      gql`
        mutation {
          createUser(
            input: {
              email: "sylvia@example.com"
              name: "Sylvia"
              password: "sylvia"
            }
          ) {
            clientMutationId
          }
        }
      `,
      "Email has already been taken"
    );
  });

  step("delete an ID that doesn't exist fails", async () => {
    await expectGqlToFail(
      gql`
        mutation {
          deleteUser(input: { id: "7aba5479-a131-4736-b061-b1bac7f608e2" }) {
            clientMutationId
          }
        }
      `,
      "no user found with ID 7aba5479-a131-4736-b061-b1bac7f608e2"
    );
  });

  step("delete Linda succeeds", async () => {
    const result = await gqlRequest(
      gql`
        mutation {
          deleteUser(input: { id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522" }) {
            user {
              id
              name
              email
            }
          }
        }
      `
    );
    expect(result.deleteUser.user).to.eql({
      id: "b4db7b4e-7dd6-448f-a3a4-8ccf4fcfe522",
      name: "Linda",
      email: "linda@example.com",
    });
  });

  step("users no longer returns Linda", async () => {
    const result = await gqlRequest(
      gql`
        {
          users {
            id
            email
            name
          }
        }
      `
    );
    const expected = [
      {
        id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
        email: "joe@example.com",
        name: "Joe",
      },
      {
        id: sylvia_id,
        email: "sylvia@example.com",
        name: "Sylvia",
      },
    ];
    expect(result.users.length).to.eql(expected.length);
    for (let expectedUser of expected) {
      expect(result.users.find((u) => u.id === expectedUser.id)).to.eql(
        expectedUser
      );
    }
  });
});
