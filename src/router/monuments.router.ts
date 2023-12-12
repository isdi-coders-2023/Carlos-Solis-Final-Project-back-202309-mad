import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { MonumentsMongoRepo } from '../repos/monuments/monuments.mongo.repo.js';
import { MonumentController } from '../controllers/monument.controller.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('ProjectFinal:Monumentsrouter');
debug('Loaded');

const repo = new MonumentsMongoRepo();
const monumentController = new MonumentController(repo);
const fileInterceptor = new FileInterceptor();
const interceptor = new AuthInterceptor();

export const monumentRouter = createRouter();
monumentRouter.get('/', monumentController.getAll.bind(monumentController));
monumentRouter.get('/:id', monumentController.getById.bind(monumentController));
monumentRouter.post(
  '/create',
  interceptor.authorization.bind(interceptor),
  fileInterceptor.singleFileStore('img').bind(fileInterceptor),
  monumentController.create.bind(monumentController)
);
monumentRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  fileInterceptor.singleFileStore('img').bind(fileInterceptor),
  monumentController.update.bind(monumentController)
);
monumentRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  monumentController.delete.bind(monumentController)
);
