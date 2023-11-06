import { GraphQLError } from 'graphql';
import { Post, QueryResolvers } from '../__generated__/graphql.js';

const queries: QueryResolvers = {
  async me(_parent, _args, { db }) {
    const me = await db.user.findFirstOrThrow({ where: { email: 'joe@example.com' } });
    return { ...me, posts: [], reactions: [] };
  },

  async post(_parent, { id }, { db }) {
    const post = await db.post.findUnique({ where: { id } });
    if (!post) throw new GraphQLError('Post not found');
    // return post;
    return { ...post, author: undefined, reactions: undefined };
  },

  async posts(_parent, {}, { db }) {
    const posts = await db.post.findMany();
    // return await posts;
    // return (await posts).map((p) => ({ ...p, author: undefined }));
    return posts as unknown[] as Post[];
  },

  async user(_parent, { id }, { db }) {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new GraphQLError('User not found');
    // return user;
    return { ...user, posts: [], reactions: [] };
  },

  async users(_parent, _args, { db }) {
    const users = await db.user.findMany();
    // return users;
    return users.map((u) => ({ ...u, posts: undefined, reactions: undefined }));
  },
};

export default queries;
