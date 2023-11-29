import { MutationResolvers } from '../__generated__/graphql';

const logOut: MutationResolvers['logOut'] = async (
  _parent,
  { input: { clientMutationId } },
  { db, currentSession }
) => {
  await db.apiSession.delete({ where: currentSession });
  return { clientMutationId };
};

export default logOut;
