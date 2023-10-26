import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { GraphQLClient, Variables, gql } from 'graphql-request';
import { compact } from 'lodash';

interface ExampleConfig {
  dataInitCommand: string;
  graphQLEndpoint: string;
}

const examplePath: string = (function () {
  const exampleName = process.env.EXAMPLE;
  if (!exampleName) {
    throw 'Environment variable EXAMPLE must be set.';
  }
  return `examples/${exampleName}`;
})();

const config: ExampleConfig = JSON.parse(readFileSync(`${examplePath}/example_test_config.json`).toString());

let bearerToken: string | null;

function dataCleanState(): void {
  // Clean up database
  // execSync(config.dataInitCommand, { cwd: examplePath });
}

function declareScenario(only: boolean, name: string, body: () => void): void {
  const describeBodyWrapper = (): void => {
    beforeAll(() => {
      bearerToken = null;
      dataCleanState();
    });

    body();
  };
  if (only) {
    describe.only(name, describeBodyWrapper);
  } else {
    describe(name, describeBodyWrapper);
  }
}

export function scenario(name: string, body: () => void): void {
  declareScenario(false, name, body);
}

export function fscenario(name: string, body: () => void): void {
  declareScenario(true, name, body);
}

export function setToken(token: string | null): void {
  bearerToken = token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function gqlRequest({ query, variables = {} }: { query: string; variables?: Variables }): Promise<any> {
  const headers: Record<string, string> = {};
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  const graphQLClient = new GraphQLClient(config.graphQLEndpoint, { headers });
  return await graphQLClient.request(query, variables);
}

export async function expectGqlToFail({
  query,
  variables = {},
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
      fail(
        `no error returned containing: ${expectedErrorMsg}\n     Message:\n${messages.map((m) => `        - "${m}"`)}`
      );
    }
  }
  return error;
}

export function login(userName: string): void {
  test(`login as ${userName}`, async () => {
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
    fail('expecting a failure');
  } catch (e) {
    return e;
  }
}
