import { ImgData } from '../types/img.data.js';
import { User } from './user.js';

export type Monument = {
  id: string;
  name: string;
  culture: string;
  description: string;
  author: User;
  monumentImg: ImgData;
  category: 'Arab' | 'Roman';
};
