import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { MonumentsMongoRepo } from '../repos/monuments/monuments.mongo.repo.js';

const debug = createDebug('W9E:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, _res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authentication(req: Request, _res: Response, next: NextFunction) {
    try {
      const userID = req.body.userId;
      const monumentToAddID = req.params.id;
      const repoMonuments = new MonumentsMongoRepo();
      const monumentItem = await repoMonuments.getById(monumentToAddID);
      if (monumentItem.author.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }
}
