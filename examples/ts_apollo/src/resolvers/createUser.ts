import { MutationResolvers } from '../__generated__/graphql';
import { generatePasswordDigest } from '../models/user.js';

const createUser: MutationResolvers['createUser'] = async (
  _parent,
  { input: { clientMutationId, email, name, password } },
  { db, authorize, serverSalt }
) => {
  await authorize();
  const passwordDigest = generatePasswordDigest(serverSalt, password);
  const user = await db.user.create({ data: { email, name, passwordDigest } });
  return { clientMutationId, user };
};

export default createUser;
