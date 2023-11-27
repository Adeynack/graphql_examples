import { Emotion, Post, PostResolvers } from '../__generated__/graphql';

const postResolvers: PostResolvers = {
  author: async (parent: Post, _args, { db }) => {
    return await db.user.findUnique({ where: { id: parent.authorId } });
  },

  reactions: async (parent: Post, _args, { db }) => {
    const reactions = await db.reaction.findMany({ where: { postId: parent.id } });
    // return reactions;
    return reactions.map((r) => ({
      ...r,
      emotion: r.emotion as Emotion, // todo: Understand how enums work between Prisma and Apollo, and get rid of this entire `.map` block
      post: parent,
    }));
  },
};

export default postResolvers;
