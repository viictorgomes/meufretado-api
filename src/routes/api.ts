import { Route } from '../types';
import { Request, Response, NextFunction } from 'express';

const teste = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
   
    res.status(200).json('Sucesso!');

  };

export const api: Route[] = [
  {
    method: 'get',
    path: '/',
    handlers: [teste]
  },
]