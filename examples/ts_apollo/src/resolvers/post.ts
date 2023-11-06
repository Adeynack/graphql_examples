import { Emotion, Post, PostResolvers, User } from '../__generated__/graphql';

const postResolvers: PostResolvers = {
  author: async (parent: Post, _args, { db }) => {
    const author = await db.user.findUnique({ where: { id: parent.authorId } });
    return author as unknown as User;
  },

  reactions: async (parent: Post, _args, { db }) => {
    const reactions = await db.reaction.findMany({ where: { postId: parent.id } });
    // return reactions;
    return reactions.map((r) => ({ ...r, emotion: r.emotion as Emotion, post: parent, user: undefined }));
  },
};

export default postResolvers;
