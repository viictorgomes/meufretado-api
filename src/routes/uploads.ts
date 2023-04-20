import { Route } from '../types';
import { Request, Response, NextFunction } from 'express';
import { DBFiles } from '../models/dbfiles';
import { withAuth, checkAuth } from '../middlewares/withAuth';

const fileDraw = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

  const file = await DBFiles.findById(req.params.id);

  if(file)
  {
      res.contentType(file.contentType);
      res.send(file.data);
      return;
  }
    
    res.status(404);

  };

export const uploads: Route[] = [
  {
    method: 'get',
    path: '/:id',
    handlers: [fileDraw]
  },
]