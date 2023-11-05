import { GraphQLError } from 'graphql';
import { QueryResolvers } from './__generated__/graphql.js';

const queries: QueryResolvers = {
  async me(_parent, _args, { db }) {
    const me = await db.user.findFirstOrThrow({ where: { email: 'joe@example.com' } });
    return { ...me, posts: [], reactions: [] };
  },

  async post(_parent, { id }, { db }, info) {
    console.log('post / info', info);
    const post = await db.post.findUnique({ where: { id }, include: { author: true } });
    if (!post) throw new GraphQLError('Post not found');
    const author = post.author;
    return {
      ...post,
      author: { ...author, posts: [], reactions: [] },
    };
  },

  // async posts() {
  //   return [];
  // },

  // async user(_parent, { id }, { store }) {
  //   const user = store.users.find((u) => u.id === id);
  //   if (!user) throw new GraphQLError('User not found');
  //   return { ...user, posts: [], reactions: [] };
  // },

  // async users(_parent, _args, { store }) {
  //   return store.users
  //     .sort((a, b) => a.email.localeCompare(b.email))
  //     .map((u) => {
  //       return {
  //         ...u,
  //         posts: [],
  //         reactions: [],
  //       };
  //     });
  // },
};

export default queries;
