import createDebug from 'debug';

const debug = createDebug('ProjectFinal:login.response');

import { User } from '../entities/user.js';

export type LoginResponse = {
  user: User;
  token: string;
};
debug('LoginResponseInstantiated');
