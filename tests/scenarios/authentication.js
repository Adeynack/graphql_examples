const expect = require("expect.js");
const { step } = require("mocha-steps");
const { scenario, gqlRequest, setToken } = require("../test_utils");
const { gql } = require("graphql-request");

scenario("Authentication", () => {
  step("me is null before first login", async () => {
    result = await gqlRequest(
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

  let joeId = null;
  step("login succeeds with valid credentials", async () => {
    result = await gqlRequest(
      gql`
        mutation {
          logIn(input: { email: "joe@example.com", password: "joe" }) {
            token
            user {
              id
              name
              email
            }
          }
        }
      `
    );

    expect(result.logIn.token).not.to.be(null);
    setToken(result.logIn.token);

    joeId = result.logIn.user.id;
    expect(result.logIn.user).to.eql({
      id: joeId,
      name: "Joe",
      email: "joe@example.com",
    });
  });

  step("me is set to the user who just logged in", async () => {
    result = await gqlRequest(
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
      id: joeId,
      name: "Joe",
      email: "joe@example.com",
    });
  });

  step("logout succeeds", async () => {
    result = await gqlRequest(
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
