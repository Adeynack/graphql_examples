import { Post, PostResolvers } from '../__generated__/graphql';

const postResolvers: PostResolvers = {
  author: async (parent: Post, _args, { db }) => {
    return await db.user.findUnique({ where: { id: parent.authorId } });
  },

  reactions: async (parent: Post, _args, { db }) => {
    const reactions = await db.reaction.findMany({ where: { postId: parent.id } });
    return reactions.map((r) => ({ ...r, post: parent }));
  },
};

export default postResolvers;
