const fs = require("fs");
const { execSync } = require("child_process");
const { GraphQLClient, gql } = require("graphql-request");
const fetchCookie = require("fetch-cookie");
const crossFetch = require("cross-fetch");
const assert = require("assert");
const { step } = require("mocha-steps");
const expect = require("expect.js");

let config;
let examplePath;
let bearerToken;

function init() {
  bearerToken = null;
  if (!config) {
    exampleName = process.env.EXAMPLE;
    if (!exampleName) {
      throw "Environment variable EXAMPLE must be set.";
    }
    examplePath = `../examples/${exampleName}`;
    config = JSON.parse(
      fs.readFileSync(`${examplePath}/example_test_config.json`)
    );
  }
}

function dataCleanState() {
  // Clean up database
  execSync(config.dataInitCommand, { cwd: examplePath });
}

function scenario(name, body) {
  init();

  describe(name, () => {
    before(() => {
      dataCleanState();
    });

    body();
  });
}

function setToken(token) {
  bearerToken = token;
}

async function gqlRequest({query, variables = null}) {
  let headers = {};
  if (bearerToken) {
    headers["Authorization"] = `Bearer ${bearerToken}`;
  }
  let graphQLClient = new GraphQLClient(config.graphQLEndpoint, { headers });
  return await graphQLClient.request(query, variables);
}

async function expectGqlToFail({query, variables = null, expectedMessages}) {
  const error = await expectAsyncException(async () => {
    await gqlRequest({query, variables});
  });
  const messages = error.response.errors.map((e) => e.message);
  for (let expectedErrorMsg of expectedMessages) {
    const matchingErrorMsg = messages.find((m) => m.includes(expectedErrorMsg));
    if (matchingErrorMsg === undefined) {
      expect().fail(
        `no error returned containing: ${expectedErrorMsg}\n     Message:\n${messages.map(
          (m) => `        - "${m}"`
        )}`
      );
    }
  }
  return error;
}

function login(user) {
  step(`login as ${user}`, async () => {
    await gqlRequest(
      gql`
        mutation {
          login(input: { email: "${user}@example.com", password: "${user}" }) {
            clientMutationId
          }
        }
      `
    );
  });
}

async function expectAsyncException(failing_function) {
  try {
    await failing_function();
    expect().fail("expecting a failure");
  } catch (e) {
    return e;
  }
}

module.exports = {
  scenario,
  setToken,
  gqlRequest,
  login,
  expectAsyncException,
  expectGqlToFail,
};
