import { Monument } from '../entities/monument.model';

import createDebug from 'debug';
import { Controller } from './controller.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { MediaFiles } from '../services/media.file.js';
import { MonumentsMongoRepo } from '../repos/monuments/monuments.mongo.repo.js';

const debug = createDebug('ProjectFinal:monumentcontroller');

export class MonumentController extends Controller<Monument> {
  declare cloudinaryService: MediaFiles;
  constructor(protected repo: MonumentsMongoRepo) {
    super(repo);
    this.cloudinaryService = new MediaFiles();
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };
      if (!req.file)
        throw new HttpError(406, 'Not Acceptable', 'Multer file is invalid');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.img = imgData;
      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    req.body.author = { id: req.body.userId };
    if (req.file) {
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);

      req.body.modelImg = imgData;
    }

    super.update(req, res, next);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new HttpError(400, 'Bad Request', 'Invalid ID');
      }

      await this.repo.delete(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
