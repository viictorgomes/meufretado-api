import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import Boom from '@hapi/boom';
import { User } from '../../models/user';

interface RequestBody {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  grupo: 'motorista' | 'passageiro';
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data : RequestBody = req.body;
  
    const registeredUser = await User.find({ email: data.email });
    const registeredCPF = await User.find({ cpf: data.cpf });

    if (registeredUser.length > 0)
    {
      res.status(200).json({
        message: 'Este email já está cadastrado em nosso sistema',
      });

      return;
    }

    if (registeredCPF.length > 0)
    {
      res.status(200).json({
        message: 'Este CPF já está cadastrado em nosso sistema',
      });

      return;
    }

    const encryptedPassword = await bcrypt.hash(data.senha, 10);
    const emailToken = crypto.randomBytes(16).toString('hex');
    const userDoc = new User({
      ...data,
      senha: encryptedPassword,
    });
    
    await userDoc.save();

    res.status(201).json({
      message: 'Conta criada com sucesso!',
    });
  } catch (e) {
    next(e);
  }
};
