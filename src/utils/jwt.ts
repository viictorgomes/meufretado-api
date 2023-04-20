import { Request } from 'express';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { SECRET_JWT } from './env';
import { JwtPayload } from '../types';

export const createToken = (payload: JwtPayload, duration: string = '30m') =>
  new Promise((res, rej) => {
    jwt.sign(
      payload,
      SECRET_JWT as string,
      { expiresIn: duration, subject: payload.email },
      (error, token) => {
        if (error) rej(error);
        else res(token);
      }
    );
  });

export const retrieveBearerToken = (req: Request) => {
  const header: string | undefined = req.headers['authorization'] as string;
  let token: null | JwtPayload = null;

  if (header && header.startsWith('Bearer')) {
    const [_, value] = header.split(' ');
    if (value) token = jwtDecode(value);
  }

  return token;
};
