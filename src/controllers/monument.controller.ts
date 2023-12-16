import { Monument } from '../entities/monument.model.js';
import { MonumentsMongoRepo } from '../repos/monuments/monuments.mongo.repo.js';
import createDebug from 'debug';
import { Controller } from './controller.js';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { MediaFiles } from '../services/media.file.js';

const debug = createDebug('ProjectFinal:controller:monument');

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
        throw new HttpError(406, 'Not Acceptable', ' Invalid multer file');
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      console.log('Desde Controller', imgData);
      req.body.monumentImg = imgData;
      const result = await this.repo.create(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = req.body.userId;

      if (req.file) {
        const imgData = await this.cloudinaryService.uploadImage(req.file.path);
        req.body.monumentImg = imgData;
      }

      const result = await this.repo.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new HttpError(400, 'Bad Request', 'ID is missing');
      }

      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.send('Deleted');
    } catch (error) {
      next(error);
    }
  }
}
