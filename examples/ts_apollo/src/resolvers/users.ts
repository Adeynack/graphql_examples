import { User, UserResolvers } from '../__generated__/graphql';

const userResolvers: UserResolvers = {
  posts: async (parent: User, _args, { db }) => {
    return await db.post.findMany({ where: { authorId: parent.id } });
  },

  reactions: async (parent: User, _args, { db }) => {
    return await db.reaction.findMany({ where: { userId: parent.id } });
  },
};

export default userResolvers;
