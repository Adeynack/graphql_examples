import { GraphQLError } from 'graphql';
import { QueryResolvers } from './__generated__/graphql.js';

const queries: QueryResolvers = {
  async me(_parent, _args, { store }) {
    const me = store.users.find((u) => u.email === 'joe@example.com');
    return { ...me, posts: [], reactions: [] };
  },

  async post(_parent, { id }, { store }) {
    const post = store.posts.find((post) => post.id === id);
    if (!post) throw new GraphQLError('Post not found');
    return post;
  },

  async posts() {
    return [];
  },

  async user(_parent, { id }, { store }) {
    const user = store.users.find((u) => u.id === id);
    if (!user) throw new GraphQLError('User not found');
    return { ...user, posts: [], reactions: [] };
  },

  async users(_parent, _args, { store }) {
    return store.users
      .sort((a, b) => a.email.localeCompare(b.email))
      .map((u) => {
        return {
          ...u,
          posts: [],
          reactions: [],
        };
      });
  },
};

export default queries;
