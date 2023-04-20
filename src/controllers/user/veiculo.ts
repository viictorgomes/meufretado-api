import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

import { retrieveBearerToken } from '../../utils/jwt';

import { User } from '../../models/user';
import { Veiculo } from '../../models/veiculo';

import { DBFiles } from '../../models/dbfiles';
import * as Multer from 'multer';
import { Types } from 'mongoose';

import crypto from 'crypto';
import { ViagemDados } from '../../models/viagemdados';

export const UploadImage = async (userId: string, file: Express.Multer.File): Promise<Types.ObjectId> => 
{
  var encoded = crypto.createHash('sha256').update(file.buffer).digest('base64');
  
  var has = await DBFiles.findOne({hash: encoded});

  if(has)
  {
    return has._id
  }

  const dbFile = new DBFiles({owner: userId, contentType: file.mimetype, data: file.buffer, hash: encoded});
  return (await dbFile.save())._id
}

export const AddVeiculo = async (
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

    const userId = userToken.userId as any;

    const uploaded : any = req.files;
    const ducumentoFile = await UploadImage(userId, uploaded['documentoFile'][0] as Express.Multer.File);
    const frenteFile = await UploadImage(userId, uploaded['frenteFile'][0] as Express.Multer.File);
    const lateralFile = await UploadImage(userId, uploaded['lateralFile'][0] as Express.Multer.File);
    const ccDoc = new Veiculo({
      ...data,
      owner: userId,
      documento: ducumentoFile,
      frente: frenteFile,
      lateral: lateralFile,
    });

    await ccDoc.save();

    ccDoc.getChanges();

    res.status(200).json({
      message: 'Veículo registrado com sucesso!',
    });
  } catch (e) {
    next(e);
  }
};

export const RemoverVeiculo = async (
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

    const userId = userToken.userId as any;

    const temViagem = await ViagemDados.findOne({veiculo: data.id})

    if(temViagem)
    {
      res.status(201).json({
        message: 'Você não pode remover o veículo de uma viagem.',
      });
      return;
    }

    await Veiculo.findByIdAndRemove(data.id);

    res.status(200).json({
      message: 'Veículo removido com sucesso!',
    });
  } catch (e) {
    next(e);
  }
};

export const ListarVeiculo = async (
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

    const MeusCarros = await Veiculo.find({owner: userId});

    res.status(200).json(MeusCarros ?? []);
  } catch (e) {
    next(e);
  }
};