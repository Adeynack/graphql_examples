import { MutationResolvers } from '../__generated__/graphql';
import logIn from './logIn.js';
import logOut from './logOut.js';

const mutation: MutationResolvers = {
  logIn,
  logOut,
};

export default mutation;
