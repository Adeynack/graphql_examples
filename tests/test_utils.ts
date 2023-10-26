import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { GraphQLClient, Variables, gql } from 'graphql-request';
import { step } from 'mocha-steps';
import expect = require('expect.js');
import { before, describe } from 'mocha';
import { compact } from 'lodash';

interface ExampleConfig {
  dataInitCommand: string;
  graphQLEndpoint: string;
}

let config: ExampleConfig;
let examplePath: string;
let bearerToken: string;

function init(): void {
  bearerToken = null;
  if (!config) {
    const exampleName = process.env.EXAMPLE;
    if (!exampleName) {
      throw 'Environment variable EXAMPLE must be set.';
    }
    examplePath = `../examples/${exampleName}`;
    config = JSON.parse(readFileSync(`${examplePath}/example_test_config.json`).toString());
  }
}

function dataCleanState(): void {
  // Clean up database
  execSync(config.dataInitCommand, { cwd: examplePath });
}

export function scenario(name: string, body: () => void): void {
  init();

  describe(name, () => {
    before(() => {
      dataCleanState();
    });

    body();
  });
}

export function setToken(token: string): void {
  bearerToken = token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function gqlRequest({ query, variables = null }: { query: string; variables?: Variables }): Promise<any> {
  const headers = {};
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, { headers });
  return await graphQLClient.request(query, variables);
}

export async function expectGqlToFail({
  query,
  variables = null,
  expectedMessages,
}: {
  query: string;
  variables?: Variables;
  expectedMessages: string[];
}): Promise<void> {
  const error = await expectAsyncException(async () => {
    await gqlRequest({ query, variables });
  });
  const messages: string[] = compact((error.response.errors || []).map((e: { message: string }) => e.message));
  for (const expectedErrorMsg of expectedMessages) {
    const matchingErrorMsg = messages.find((m) => m.includes(expectedErrorMsg));
    if (matchingErrorMsg === undefined) {
      expect().fail(
        `no error returned containing: ${expectedErrorMsg}\n     Message:\n${messages.map((m) => `        - "${m}"`)}`
      );
    }
  }
  return error;
}

export function login(userName: string): void {
  step(`login as ${userName}`, async () => {
    const result = await gqlRequest({
      query: gql`
        mutation {
          logIn(input: { email: "joe@example.com", password: "joe" }) {
            token
          }
        }
      `,
    });
    setToken(result.logIn.token);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function expectAsyncException(failing_function: () => Promise<void>): Promise<any> {
  try {
    await failing_function();
    expect().fail('expecting a failure');
  } catch (e) {
    return e;
  }
}
