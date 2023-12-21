import { Monument } from '../../entities/monument.model';
import createDebug from 'debug';
import { monumentModel } from './monuments.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { UserMongoRepo } from '../users/users.mongo.repo.js';
import { Repository } from '../repo.js';
import { UserModel } from '../users/users.mongo.model.js';
const debug = createDebug('ProjectFinal:mongo:repo');
export class MonumentsMongoRepo implements Repository<Monument> {
  userRepo: UserMongoRepo;
  constructor() {
    this.userRepo = new UserMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Monument[]> {
    const result = await monumentModel
      .find()
      .populate('author', { monuments: 0 })
      .exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');

    return result;
  }

  async getById(id: string): Promise<Monument> {
    const result = await monumentModel
      .findById(id)
      .populate('author', {
        monuments: 0,
      })
      .exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'findById method not possible');
    return result;
  }

  async create(newItem: Omit<Monument, 'id'>): Promise<Monument> {
    try {
      const userID = newItem.author.id;
      if (!userID) {
        throw new HttpError(400, 'Bad Request', 'Author ID is missing');
      }

      const user = await this.userRepo.getById(userID);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      const result: Monument = await monumentModel.create({
        ...newItem,
        author: userID,
      });
      user.monuments.push(result);
      await this.userRepo.update(userID, user);
      return result;
    } catch (error) {
      console.error('Error in create method:', error);
      throw error;
    }
  }

  async update(id: string, updatedItem: Partial<Monument>): Promise<Monument> {
    const result = await monumentModel
      .findByIdAndUpdate(id, updatedItem, {
        new: true,
      })
      .populate('author', { monuments: 0 })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = (await monumentModel
      .findByIdAndDelete(id)
      .exec()) as unknown as Monument;
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await UserModel.findByIdAndUpdate(result.author, {
      $pull: { monuments: id },
    }).exec();
  }
}
