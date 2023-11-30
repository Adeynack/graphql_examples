import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../__generated__/graphql';
import _ from 'lodash';
import { generatePasswordDigest } from '../models/user.js';

const updateUser: MutationResolvers['updateUser'] = async (
  _parent,
  { input: { clientMutationId, id, email, name, password } },
  { authorize, db, serverSalt }
) => {
  await authorize();

  let user = await db.user.findUnique({ where: { id } });
  if (!user) throw new GraphQLError('User not found');

  const passwordDigest = password && generatePasswordDigest(serverSalt, password);
  const updatedAttributes = _.omitBy({ email, name, passwordDigest }, _.isUndefined);
  user = await db.user.update({ where: { id }, data: updatedAttributes });

  return { clientMutationId, user };
};

export default updateUser;
