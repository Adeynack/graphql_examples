const expect = require("expect.js");
const { step } = require("mocha-steps");
const { scenario, gqlRequest, login } = require("../test_utils");
const { gql } = require("graphql-request");

scenario("Query as normal user", () => {
  login("joe");

  step("users returns all known users", async () => {
    result = await gqlRequest(
      false,
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
    console.log(result.users);
    let expected = [
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
});
