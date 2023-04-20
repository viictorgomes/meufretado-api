import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import Boom from '@hapi/boom';
import { createToken } from '../../utils/jwt';

export const login = async (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('basic', (error, user) => {

    if (error) return next(error);
    if (!user) return next(Boom.unauthorized());

    req.login(user, { session: false }, async (err) => {
      if (err) return next(err);

      if (!user) return next(Boom.unauthorized());

      try {
        const tokenPayload = {
          email: user.email,
          userId: user._id,
          grupo: user.grupo,
        };

        const token = await createToken(tokenPayload, '7d');

        res.status(200).json({
          user,
          token,
        });
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);