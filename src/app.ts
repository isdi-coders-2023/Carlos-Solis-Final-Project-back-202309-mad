import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Import { monumentsRouter } from './routers/monuments.routes.js';
import createDebug from 'debug';
import { errorMiddleware } from './middleware/error.middleware.js';
import { userRouter } from './router/users.router.js';
import { monumentRouter } from './router/monuments.router.js';

const debug = createDebug('ProjectFinal:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/monuments', monumentRouter);
app.use('/users', userRouter);

app.use(errorMiddleware);
