import { MutationResolvers } from '../__generated__/graphql';

const deleteUser: MutationResolvers['deleteUser'] = async (
  _parent,
  { input: { clientMutationId } },
  { authorize, getCurrentUser }
) => {
  await authorize();
  return { clientMutationId, user: await getCurrentUser() };
};

export default deleteUser;
