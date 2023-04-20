import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import Boom from '@hapi/boom';
import '../utils/authStrategies';

export const withAuth =
  (grupo: 'motorista' | 'passageiro') =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user) return next(Boom.unauthorized());
      if (user.grupo !== grupo) return next(Boom.unauthorized());

      req.login(user, { session: false }, (err) => {
        if (err) next(err);

        next();
      });
    })(req, res, next);
  };

export const checkAuth = () =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (error, user) => {
      if (error || !user) return next(Boom.unauthorized())
      req.login(user, { session: false }, (err) => {
        if (err) next(err);

        next();
      });
    })(req, res, next);
  };

