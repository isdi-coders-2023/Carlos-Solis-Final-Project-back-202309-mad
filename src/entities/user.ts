export type LoginUser = {
  passwd: string;
  email: string;
};
export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  monuments: User[];
};
