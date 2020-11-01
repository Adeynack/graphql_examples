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
let graphQLClient;

function init() {
  if (!config) {
    exampleName = process.env.EXAMPLE;
    if (!exampleName) {
      throw "Environment varialbe EXAMPLE must be set.";
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

  // Clean up cookie jar
  const fetch = fetchCookie(crossFetch);
  graphQLClient = new GraphQLClient(config.graphQLEndpoint, { fetch });
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

async function gqlRequest(query) {
  return await graphQLClient.request(query);
}

async function expectGqlToFail(query, expectedErrorMessages) {
  error = await expectAsyncException(async () => {
    await gqlRequest(query);
  });
  if (typeof expectedErrorMessages !== "array") {
    expectedErrorMessages = [expectedErrorMessages];
  }
  const messages = error.response.errors.map((e) => e.message);
  for (let expectedErrorMsg of expectedErrorMessages) {
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
  gqlRequest,
  login,
  expectAsyncException,
  expectGqlToFail,
};
