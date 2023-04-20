import express from 'express';
import helmet from 'helmet';

import { connectDb } from './db/connection';

import { createRoutes } from './routes/createRoutes';
import { corsOrigin, errorHandlers, notFound } from './middlewares';

import { api } from './routes/api';
import { auth } from './routes/auth';
import { userRoute } from './routes/user'
import { viagem } from './routes/viagem';
import { uploads } from './routes/uploads';


import './utils/authStrategies';
//import { upload } from './utils/upload';

const app = express();

//db connection
connectDb();

app.use(corsOrigin());
app.use(express.json());
app.use(helmet());

createRoutes('/api', api, app);
createRoutes('/auth', auth, app);
createRoutes('/user', userRoute, app);
createRoutes('/viagem', viagem, app);
createRoutes('/uploads', uploads, app);

//error handlers
app.use(errorHandlers.errorBoomImplementation);
app.use(errorHandlers.errorHandler);

//404
app.use(notFound);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.info(`Servidor rodando http://localhost:${port}`);
});
