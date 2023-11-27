import { Emotion, User, UserResolvers } from '../__generated__/graphql';

const userResolvers: UserResolvers = {
  posts: async (parent: User, _args, { db }) => {
    return await db.post.findMany({ where: { authorId: parent.id } });
  },

  reactions: async (parent: User, _args, { db }) => {
    return (await db.reaction.findMany({ where: { userId: parent.id } })).map((r) => ({
      ...r,
      emotion: r.emotion as Emotion, // todo: Understand how enums work between Prisma and Apollo, and get rid of this entire `.map` block
    }));
  },
};

export default userResolvers;
