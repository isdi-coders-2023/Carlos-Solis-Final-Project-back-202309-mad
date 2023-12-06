import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo';
import { UsersController } from '../controllers/users.controllers';

const debug = createDebug('FinalProject:users:router');
debug('Loaded');

const repo = new UsersMongoRepo();
const userController = new UsersController(repo);

export const userRouter = createRouter();
userRouter.get('/', userController.getAll.bind(userController));
userRouter.post('/register', userController.create.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
