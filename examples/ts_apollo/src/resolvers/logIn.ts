import { GraphQLError } from 'graphql';
import { LogInResult, MutationLogInArgs, User } from '../__generated__/graphql';
import { Context } from '../context';

export default async function (
  _parent: unknown,
  { input: { email } }: MutationLogInArgs,
  { db }: Context
): Promise<LogInResult> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new GraphQLError('User not found');
  return {
    token: 'token 123456',
    user: user as unknown as User,
  };
}
