import { Route } from '../types';
import { signUp } from '../controllers/auth/signup';
import { login } from '../controllers/auth/login';

import {
  schemeSignup,
} from '../utils/validationSchemes/auth';

import { validateScheme } from '../middlewares';

import { withAuth, checkAuth } from '../middlewares/withAuth';

import { Request, Response, NextFunction } from 'express';

const Ret200 = async (req: Request, res: Response, next: NextFunction) =>
{
  res.status(200).json({});
};

export const auth: Route[] = [
  {
    method: 'post',
    path: '/session',
    handlers: [
      checkAuth(),
      Ret200,
    ],
  },
    {
      path: '/signup',
      method: 'post',
      handlers: [validateScheme(schemeSignup), signUp],
    },
    {
        path: '/login',
        method: 'post',
        handlers: [login],
      },
]