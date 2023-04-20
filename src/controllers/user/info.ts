import Boom from '@hapi/boom';
import bcrypt from 'bcryptjs';

import { Request, Response, NextFunction } from 'express';

import { retrieveBearerToken } from '../../utils/jwt';

import { User } from '../../models/user';

import { UploadImage } from './veiculo';

export const SaldoInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const userToken = retrieveBearerToken(req);
    
    if(!userToken)
    {
      res.status(401).json({
        message: 'Erro na sessão, tente novamente mais tarde.',
      });
      return;
    }

    const userId = userToken.userId;


    var userInfo = await User.findById(userId);
    if(userInfo)
      res.status(200).json({saldo: userInfo.saldo.toFixed(2), perfil: userInfo.perfil ? userInfo.perfil : ''});
    else
      res.status(200).json(0);

  } catch (e) {
    next(e);
  }
};

export const AttPerfil = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const userToken = retrieveBearerToken(req);
    
    if(!userToken)
    {
      res.status(401).json({
        message: 'Erro na sessão, tente novamente mais tarde.',
      });
      return;
    }

    const userId = userToken.userId;


    var userInfo = await User.findById(userId);

    if(userInfo)
    {
      var cpy = req.body;

      if(cpy.senha)
      {
        cpy.senha = await bcrypt.hash(cpy.senha, 10);;
      }
      
      if(req.file)
      {
        const profileImage = await UploadImage(userId, req.file);
        cpy.perfil = profileImage
      }
      
      await User.updateOne({_id: userId}, {...cpy});
      res.status(200).json({
        message: 'Perfil atualizado com sucesso!',
      });
    }
    else
    res.status(201).json({
      message: 'Falha ao atualizar os dados!',
    });

  } catch (e) {
    next(e);
  }
};