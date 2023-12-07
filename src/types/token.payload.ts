import createDebug from 'debug';

const debug = createDebug('ProjectFinal:token.payload');
debug('TokenInstantiated');

import { User } from '../entities/user.js';
import jwt from 'jsonwebtoken';

export type TokenPayload = {
  id: User['id'];
  email: string;
} & jwt.JwtPayload;
