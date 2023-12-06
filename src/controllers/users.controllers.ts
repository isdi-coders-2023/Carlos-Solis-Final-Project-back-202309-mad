import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { Controller } from './controller.js';
import { UserMongoRepo } from '../repos/users/users.mongo.repo.js';
import createDebug from 'debug';
import { LoginResponse } from '../types/login.response.js';
import { Auth } from '../services/auth.js';

const debug = createDebug('ProjectFinal:user:controller');

export class UsersController extends Controller<User> {
  constructor(protected repo: UserMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

const dateForm: string = '2034/5/23:22:12:55';
const date = new Date(dateForm);

date.getDate();
