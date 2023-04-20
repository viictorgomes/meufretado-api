import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

import { retrieveBearerToken } from '../../utils/jwt';

import { CreditCard } from '../../models/cc';
import { User } from '../../models/user';

export const AddCC = async (
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

    const data = req.body;

    const userId = userToken.userId;

    const ccDoc = new CreditCard({
      ...data,
      owner: userId
    });

    ccDoc.save();
    ccDoc.getChanges();

    await User.updateOne({_id: userId}, {currentcc: ccDoc._id});

    res.status(200).json({
      message: 'Cartão registrado com sucesso!',
    });
  } catch (e) {
    next(e);
  }
};

export const RemoveCC = async (
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

    const data = req.body;

    const userId = userToken.userId;

    var user = await User.findOne({currentcc: data._id})
    
    if(user)
      await User.updateOne({_id: userId}, {currentcc: null});

    await CreditCard.findByIdAndRemove(data._id)

    res.status(200).json({
      message: 'Cartão removido com sucesso!',
    });
  } catch (e) {
    next(e);
  }
};

export const ListCC = async (
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


    var ccs = await CreditCard.find({owner: userId});

    var ret = ccs.map(x =>{
      return {_id: x.id, numero: x.numero, validade: `${x.mes}/${x.ano}`}
    })

    res.status(200).json(ret);

  } catch (e) {
    next(e);
  }
};