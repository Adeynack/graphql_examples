/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { GraphQLClient, Variables, gql } from 'graphql-request';
import { GraphQLError } from 'graphql';

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
  execSync(config.dataInitCommand, { cwd: examplePath });
}

function declareScenario(only: boolean, name: string, body: () => void): void {
  const describeBodyWrapper = (): void => {
    beforeAll(() => {
      bearerToken = null;
      dataCleanState();
    });

    afterAll(() => {
      dataCleanState(); // leave a clean state behind
    });

    body();
  };
  if (only) {
    describe.only(name, describeBodyWrapper);
  } else {
    describe(name, describeBodyWrapper);
  }
}

export const graphQLClient = new GraphQLClient(config.graphQLEndpoint);
export const graphQLClientForFailures = new GraphQLClient(config.graphQLEndpoint, { errorPolicy: 'all' });

export function scenario(name: string, body: () => void): void {
  declareScenario(false, name, body);
}

export function fscenario(name: string, body: () => void): void {
  declareScenario(true, name, body);
}

export function getToken(): string | null {
  return bearerToken;
}

export function setToken(token: string | null): void {
  bearerToken = token;
}

function prepareHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }
  return headers;
}

export async function gqlRequest({ query, variables = {} }: { query: string; variables?: Variables }): Promise<any> {
  return await graphQLClient.request(query, variables, prepareHeaders());
}

export async function expectGqlToFail({
  query,
  variables = {},
}: {
  query: string;
  variables?: Variables;
}): Promise<GraphQLError[]> {
  const { status, errors } = await graphQLClientForFailures.rawRequest(query, variables, prepareHeaders());
  if (status !== 200) throw new Error(`Expected status 200, got ${status}`);
  if (!errors || errors.length === 0) throw new Error('Expected errors, got none');
  return errors;
}

export function login(userName: string): void {
  test(`login as ${userName}`, async () => {
    const result = await gqlRequest({
      query: gql`
        mutation {
          logIn(input: { email: "joe@example.com", password: "joe" }) {
            token
            user {
              id
            }
          }
        }
      `,
    });
    setToken(result.logIn.token);
  });
}

export async function expectAsyncException(failing_function: () => Promise<void>): Promise<any> {
  let error: any = null;
  expect(async () => {
    try {
      await failing_function();
    } catch (e) {
      error = e;
      throw e;
    }
  }).toThrow();
  return error;
}
