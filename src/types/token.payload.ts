import { User } from '../entities/user.js';
import jwt from 'jsonwebtoken';

export type TokenPayload = {
  id: User['id'];
  email: string;
} & jwt.JwtPayload;
