const assert = require("assert");
const { step } = require("mocha-steps");
const { scenario } = require("./test_utils");
const { request, gql } = require("graphql-request");

scenario("Authentication", () => {
  step("me is null before first login", async () => {
    const query = gql`
      {
        me {
          id
        }
      }
    `;
    result = await request("http://localhost:3000/api/graphql", query);
    assert.strictEqual(result.me, null);
  });

  step("login succeeds with valid credentials", async () => {
    const query = gql`
      mutation {
        login(input: { email: "joe@example.com", password: "joe" }) {
          user {
            id
            name
            email
          }
        }
      }
    `;
    result = await request("http://localhost:3000/api/graphql", query);
    user = result.login.user;
    assert.strictEqual(user.id, "d3830e3c-1f33-4a03-b24c-7b2a94fdaa44");
    assert.strictEqual(user.name, "Joe");
    assert.strictEqual(user.email, "joe@example.com");
  });
});
