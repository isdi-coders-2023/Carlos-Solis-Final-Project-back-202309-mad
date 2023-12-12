import { Monument } from '../../entities/monument.model';
import { Repository } from '../repo.js';
import createDebug from 'debug';
import { monumentModel } from './monuments.mongo.model';
import { HttpError } from '../../types/http.error.js';
import { UserMongoRepo } from '../users/users.mongo.repo.js';
import mongoose from 'mongoose';

const debug = createDebug('ProjectFinal:mongo:repo');

export class MonumentsMongoRepo implements Repository<Monument> {
  userRepo: UserMongoRepo;
  constructor() {
    this.userRepo = new UserMongoRepo();
    debug('Instantiated');
  }

  async getAll(): Promise<Monument[]> {
    const result = await monumentModel.find().exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<Monument> {
    const result = await monumentModel.findById(id).exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'findById method not possible');
    return result;
  }

  async create(newItem: Omit<Monument, 'id'>): Promise<Monument> {
    try {
      const userID = newItem.author?.id;
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
      .populate('author', { Monuments: 0 })
      .exec();

    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await monumentModel
      .findByIdAndDelete(id)
      .populate('author', {
        Monuments: 0,
      })
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    const userID = result.author?.id;
    const user = await this.userRepo.getById(userID);
    user.monuments = user.monuments.filter((item) => {
      const itemID = item as unknown as mongoose.mongo.ObjectId;
      return itemID.toString() !== id;
    });
    await this.userRepo.update(userID, user);
  }
}
