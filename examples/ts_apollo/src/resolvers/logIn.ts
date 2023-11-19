import { LogInResult, MutationLogInArgs, User } from '../__generated__/graphql';
import { Context } from '../context';

export default async function (
  _parent,
  { input: { email } }: MutationLogInArgs,
  { db }: Context
): Promise<LogInResult> {
  const user = await db.user.findUniqueOrThrow({ where: { email } });
  return {
    token: 'token 123456',
    user: user as unknown as User,
  };
}
