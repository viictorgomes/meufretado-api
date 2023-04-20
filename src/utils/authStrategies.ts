import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { SECRET_JWT } from './env';
import { JwtPayload } from '../types';

passport.use(
  new BasicStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user) return done(null, false);
      if (!(await bcrypt.compare(password, user.senha)))
        return done(null, false);

      const userData = {
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        telefone: user.telefone,
        grupo: user.grupo,
        _id: user._id,
      };

      return done(null, userData);
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_JWT,
    },
    async (jwtPayload: JwtPayload, done) => {
      const grupo = jwtPayload.grupo;

      try {

        const user = await User.findOne({ email: jwtPayload.email });

        if (!user) 
            return done(null, false);

        return done(null, user);
      } catch (reason) {
        done(reason);
      }
    }
  )
);
