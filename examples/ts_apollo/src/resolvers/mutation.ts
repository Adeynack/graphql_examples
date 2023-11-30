import { MutationResolvers } from '../__generated__/graphql';
import createUser from './createUser.js';
import deleteUser from './deleteUser.js';
import logIn from './logIn.js';
import logOut from './logOut.js';
import updateUser from './updateUser.js';

const mutation: MutationResolvers = {
  logIn,
  logOut,
  createUser,
  updateUser,
  deleteUser,
};

export default mutation;
