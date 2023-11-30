import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../__generated__/graphql';
import { generatePasswordDigest } from '../models/user.js';
import { timingSafeEqual, randomBytes } from 'crypto';
import { Context } from '../context';

const logIn: MutationResolvers['logIn'] = async (
  _parent,
  { input: { email, password } },
  { db, currentSession, getCurrentUser, serverSalt }: Context
) => {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new GraphQLError('User not found');

  const hashedInputPassword = generatePasswordDigest(serverSalt, password);
  if (!timingSafeEqual(Buffer.from(hashedInputPassword), Buffer.from(user.passwordDigest)))
    throw new GraphQLError('Incorrect password');

  const currentUser = await getCurrentUser();
  if (user.id === currentUser?.id) {
    // Login in as the current user again. Reuse the same ApiSession (no new token is being generated).
    return { token: currentSession.token, user };
  }

  // Fresh login. Generate a new ApiSession (with a new token).
  const token = randomBytes(64).toString('base64');
  await db.apiSession.create({ data: { userId: user.id, token } });

  return { token, user };
};

export default logIn;
