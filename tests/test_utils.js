const fs = require("fs");
const { execSync } = require("child_process");
const { GraphQLClient } = require("graphql-request");
const fetchCookie = require("fetch-cookie");
const crossFetch = require("cross-fetch");
const assert = require("assert");

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

async function gqlRequest(expectErrors, query) {
  const result = await graphQLClient.request(query);
  if (!expectErrors && result.errors) {
    assert.strictEqual(result.errors, []);
  }
  return result;
}

module.exports = {
  scenario,
  gqlRequest,
};
