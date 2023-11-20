import { GraphQLError } from 'graphql';
import { LogInResult, MutationLogInArgs, User } from '../__generated__/graphql';
import { Context } from '../context';
import { generatePasswordDigest } from '../models/user.js';
import { timingSafeEqual } from 'crypto';

export default async function (
  _parent: unknown,
  { input: { email, password } }: MutationLogInArgs,
  { db, serverSalt }: Context
): Promise<LogInResult> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new GraphQLError('User not found');

  const hashedInputPassword = generatePasswordDigest(serverSalt, password);
  if (!timingSafeEqual(Buffer.from(hashedInputPassword), Buffer.from(user.passwordDigest)))
    throw new GraphQLError('Incorrect password');

  return {
    token: 'token 123456',
    user: user as unknown as User,
  };
}
