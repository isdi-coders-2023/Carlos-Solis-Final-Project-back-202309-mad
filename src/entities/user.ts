import { ImgData } from '../types/img.data';

export type User = {
  password: string;
  email: string;
  id: string;
  name: string;
  surname: string;
  image: ImgData;
};
