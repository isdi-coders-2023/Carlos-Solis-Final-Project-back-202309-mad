import { Monument } from './monument.model.js';

export type LoginUser = {
  email: string;
  passwd: string;
  id: string;
  name: string;
  surname: string;
  monuments: Monument[];
};
export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  monuments: Monument[];
};
