import { MutationResolvers } from '../__generated__/graphql';

const updateUser: MutationResolvers['updateUser'] = async (
  _parent,
  { input: { clientMutationId } },
  { authorize, getCurrentUser }
) => {
  await authorize();
  return { clientMutationId, user: await getCurrentUser() };
};

export default updateUser;
