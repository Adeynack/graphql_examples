import { MutationResolvers } from '../__generated__/graphql';

const createUser: MutationResolvers['createUser'] = async (
  _parent,
  { input: { clientMutationId } },
  { db, authorize }
) => {
  await authorize();
  return { clientMutationId };
};

export default createUser;
