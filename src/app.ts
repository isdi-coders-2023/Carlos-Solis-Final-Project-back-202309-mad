import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Import { monumentsRouter } from './routers/monuments.routes.js';
import createDebug from 'debug';
import { errorMiddleware } from './middleware/error.middleware.js';
import { userRouter } from './router/users.routes.js';

const debug = createDebug('FinalProject:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

// App.use('/monuments', monumentsRouter);
app.use('/users', userRouter);

app.use(errorMiddleware);
