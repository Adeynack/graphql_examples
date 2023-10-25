const expect = require("expect.js");
const { step } = require("mocha-steps");
const {
  scenario,
  gqlRequest,
  setToken,
  expectGqlToFail,
} = require("../test_utils");
const { gql } = require("graphql-request");

scenario("Authentication", () => {
  step("me is null before first login", async () => {
    const result = await gqlRequest({
      query: gql`
        {
          me {
            id
          }
        }
      `,
    });
    expect(result.me).to.be.null;
  });

  let joeId = null;
  step("login succeeds with valid credentials", async () => {
    const result = await gqlRequest({
      query: gql`
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
      `,
    });

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
    const result = await gqlRequest({
      query: gql`
        {
          me {
            id
            name
            email
          }
        }
      `,
    });
    expect(result.me).to.eql({
      id: joeId,
      name: "Joe",
      email: "joe@example.com",
    });
  });

  step("logout succeeds", async () => {
    const result = await gqlRequest({
      query: gql`
        mutation {
          logOut(input: { clientMutationId: "foo" }) {
            clientMutationId
          }
        }
      `,
    });
    expect(result.logOut.clientMutationId).to.eql("foo");
  });

  step(
    "request with invalidated token fails with 401 and a JSON error",
    async () => {
      let error = null;
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
      expect(error.response.status).to.equal(401);
      expect(error.response.status).to.equal(401);
      expect(error.response.title).to.equal("Invalid bearer token");

      setToken(null);
    }
  );

  step("me is null after logout", async () => {
    result = await gqlRequest({
      query: gql`
        {
          me {
            id
          }
        }
      `,
    });
    expect(result).to.have.property("me");
    expect(result.me).to.be(null);
  });

  step("login fails if user email does not exist", async () => {
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
      expectedMessages: ["User not found"],
    });
  });

  step("login returns null if user password does not match", async () => {
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
      expectedMessages: ["Incorrect password"],
    });
  });
});
