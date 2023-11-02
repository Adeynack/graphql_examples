import { Context } from './context.js';

export default {
  me(parent, args, contextValue, info) {
    // eslint-disable-next-line no-console
    console.log('post', { parent, args, contextValue, info });
    return {
      id: 'me',
    };
  },

  post(parent, args, contextValue, info) {
    // eslint-disable-next-line no-console
    console.log('post', { parent, args, contextValue, info });
    return {
      id: args.id,
    };
  },

  posts(parent, args, contextValue, info) {
    // eslint-disable-next-line no-console
    console.log('posts', { parent, args, contextValue, info });
    return [];
  },

  user(parent, args, contextValue: Context, info) {
    // eslint-disable-next-line no-console
    console.log('user', { parent, args, contextValue, info });
    return contextValue.store.users.find((u) => u.id === args.id);
  },

  users(parent, args, contextValue: Context, info) {
    // eslint-disable-next-line no-console
    console.log('users', { parent, args, contextValue, info });
    return contextValue.store.users.sort((a, b) => a.email.localeCompare(b.email));
  },
};
