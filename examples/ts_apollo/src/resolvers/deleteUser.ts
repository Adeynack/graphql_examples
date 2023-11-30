import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../__generated__/graphql';

const deleteUser: MutationResolvers['deleteUser'] = async (
  _parent,
  { input: { clientMutationId, id } },
  { authorize, db }
) => {
  await authorize();

  const user = await db.user.findUnique({ where: { id } });
  if (user && (await db.user.deleteMany({ where: user })).count > 0) {
    return { clientMutationId, user };
  }

  throw new GraphQLError('User not found');
};

export default deleteUser;
