const expect = require("expect.js");
const { step } = require("mocha-steps");
const { scenario, gqlRequest } = require("../test_utils");
const { gql } = require("graphql-request");

scenario("Authentication", () => {
  step("me is null before first login", async () => {
    result = await gqlRequest(
      false,
      gql`
        {
          me {
            id
          }
        }
      `
    );
    expect(result.me).to.be.null;
  });

  step("login succeeds with valid credentials", async () => {
    result = await gqlRequest(
      false,
      gql`
        mutation {
          login(input: { email: "joe@example.com", password: "joe" }) {
            user {
              id
              name
              email
            }
          }
        }
      `
    );
    expect(result.login.user).to.eql({
      id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
      name: "Joe",
      email: "joe@example.com",
    });
  });

  step("me is set to the user who just logged in", async () => {
    result = await gqlRequest(
      false,
      gql`
        {
          me {
            id
            name
            email
          }
        }
      `
    );
    expect(result.me).to.eql({
      id: "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44",
      name: "Joe",
      email: "joe@example.com",
    });
  });

  step("logout succeeds", async () => {
    result = await gqlRequest(
      false,
      gql`
        mutation {
          logout(input: { clientMutationId: "foo" }) {
            clientMutationId
          }
        }
      `
    );
    expect(result.logout.clientMutationId).to.eql("foo");
  });

  step("me is null after logout", async () => {
    result = await gqlRequest(
      false,
      gql`
        {
          me {
            id
          }
        }
      `
    );
    expect(result.me).to.be.null;
  });

  step("login returns null if user email does not exist", async () => {
    result = await gqlRequest(
      false,
      gql`
        mutation {
          login(input: { email: "foo@bar.com", password: "joe" }) {
            user {
              id
            }
          }
        }
      `
    );
    expect(result.login.user).to.be.null;
  });

  step("login returns null if user password does not match", async () => {
    result = await gqlRequest(
      false,
      gql`
        mutation {
          login(input: { email: "joe@example.com", password: "foobar" }) {
            user {
              id
            }
          }
        }
      `
    );
    expect(result.login.user).to.be.null;
  });
});
