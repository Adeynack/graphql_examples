import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Logger } from '@apollo/utils.logger';
import { Context } from './context.js';
import { GraphQLError } from 'graphql';

export class LoggingPlugin implements ApolloServerPlugin<Context> {
  async requestDidStart(): Promise<void | GraphQLRequestListener<Context>> {
    return {
      async didEncounterErrors({ errors, logger, contextValue: { queryIdentifier } }): Promise<void> {
        logErrors({ errors, logger, queryIdentifier });
      },
      async didEncounterSubsequentErrors({ errors, logger, contextValue: { queryIdentifier } }): Promise<void> {
        logErrors({ errors, logger, queryIdentifier });
      },
    };
  }
}

function logErrors({
  logger,
  errors,
  queryIdentifier,
}: {
  logger: Logger;
  errors: ReadonlyArray<Error>;
  queryIdentifier: string;
}): void {
  errors.forEach((error) => {
    if (error instanceof GraphQLError) {
      return;
    } else if (error instanceof Error) {
      const errorLines = error.toString().split('\n');
      errorLines.forEach((errorLine) => {
        logger.error(`[${queryIdentifier}] ${errorLine}`);
      });
      if (error.stack) {
        error.stack.split('\n').forEach((stackLine) => {
          logger.error(`[${queryIdentifier}] ${stackLine}`);
        });
      }
    }
  });
}
