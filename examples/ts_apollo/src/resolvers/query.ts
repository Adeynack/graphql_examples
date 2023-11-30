import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../__generated__/graphql.js';

const queries: QueryResolvers = {
  async me(_parent, _args, { getCurrentUser }) {
    return await getCurrentUser();
  },

  async post(_parent, { id }, { db }) {
    const post = await db.post.findUnique({ where: { id } });
    if (!post) throw new GraphQLError('Post not found');
    return post;
  },

  async posts(_parent, {}, { db }) {
    return await db.post.findMany();
  },

  async user(_parent, { id }, { db }) {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) throw new GraphQLError('User not found');
    return user;
  },

  async users(_parent, _args, { db }) {
    return await db.user.findMany();
  },
};

export default queries;
