import createDebug from 'debug';
import { LoginUser, User } from '../../entities/user.js';
import { Repository } from '../repo.js';
import { UserModel } from './users.mongo.model.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('ProjectFinal:users:mongo:repo');
export class UserMongoRepo implements Repository<User> {
  constructor() {
    debug('Instanciated');
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetByid not possible');
    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.passwd = await Auth.hash(newItem.passwd);
    const result: User = await UserModel.create(newItem);
    console.log(result);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email }).exec();
    if (!result || !(await Auth.compare(loginUser.passwd, result.passwd)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }
}