import { Repository } from '../repos/monument.repo.js';
import { NextFunction, Request, Response } from 'express';
import { MediaFiles } from '../services/media.file.js';

export abstract class Controller<X extends { id: unknown }> {
  cloudinaryService: MediaFiles;
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: Repository<X>) {
    this.cloudinaryService = new MediaFiles();
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
