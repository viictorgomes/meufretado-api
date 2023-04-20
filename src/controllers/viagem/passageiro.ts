import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

import { retrieveBearerToken } from '../../utils/jwt';

import { User } from '../../models/user';
import { ViagemPedido } from '../../models/viagempedido';
import { ROTA_VALOR_INICIAL, ROTA_VALOR_PASSAGEIRO, ROTA_VALOR_KM } from '../../utils/env';
import { Cidade } from '../../models/cidade';
import { Estado } from '../../models/estado';
import { ViagemDados } from '../../models/viagemdados';
import { Types } from 'mongoose';
import { SendMail } from '../../utils/sendmail';

export const CriarViagem = async (
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

    var addrEstadoA : any;
    var addrEstadoB : any;

    var addrCidadeA : any;
    var addrCidadeB : any;

    const estadoA = await Estado.findOne({nome: data.addr.a.estado});
    if(!estadoA)
    {
      const estadoDoc = new Estado({nome: data.addr.a.estado});
      await estadoDoc.save();
      estadoDoc.getChanges();
      addrEstadoA = estadoDoc._id;
    }
    else
      addrEstadoA = estadoA._id;

    const estadoB = await Estado.findOne({nome: data.addr.b.estado});
    if(!estadoB)
    {
      const estadoDoc = new Estado({nome: data.addr.b.estado});
      await estadoDoc.save();
      estadoDoc.getChanges();
      addrEstadoB = estadoDoc._id;
    }
    else
      addrEstadoB = estadoB._id;

    const cidadeA = await Cidade.findOne({nome: data.addr.a.cidade});
    if(!cidadeA)
    {
      const estado = await Estado.findOne({nome: data.addr.a.estado});
      const cidadeDoc = new Cidade({nome: data.addr.a.cidade, estado: estado?._id});
      await cidadeDoc.save();
      cidadeDoc.getChanges();
      addrCidadeA = cidadeDoc._id
    }
    else
      addrCidadeA = cidadeA._id;

    const cidadeB = await Cidade.findOne({nome: data.addr.b.cidade});
    if(!cidadeB)
    {
      const estado = await Estado.findOne({nome: data.addr.b.estado});
      const cidadeDoc = new Cidade({nome: data.addr.b.cidade, estado: estado?._id});
      await cidadeDoc.save();
      cidadeDoc.getChanges();
      addrCidadeB = cidadeDoc._id
    }
    else
    addrCidadeB = cidadeB._id

    

    const viagemDoc = new ViagemPedido({
      owner: userId,
      de: data.inicio,
      para: data.destino,
      estadoa: addrEstadoA,
      estadob: addrEstadoB,
      cidadea: addrCidadeA,
      cidadeb: addrCidadeB,
      passageiros: data.passageiros,
      coords: JSON.stringify(data.rota),
      tempo: data.tempo,
      distancia: data.distancia.value,
      data: data.data,
      carro: data.carro
    });

    await viagemDoc.save();
    viagemDoc.getChanges();

    res.status(200).json({
      message: 'Transporte solicitado com sucesso!',
      id: viagemDoc._id
    });
  } catch (e) {
    next(e);
  }
};

export const ListarViagens = async (
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

      const isMotorista = userToken.grupo == 'motorista'
  
      var final : any;

      if(isMotorista)
      {
        const dados = await ViagemDados.find({motorista: userId}).populate('viagem').lean();
        const dadosFim = dados.map(x =>{
          return {...x.viagem}
        })
        res.status(200).json(dadosFim);
        return;
      }

      var lista = await ViagemPedido.find({owner: userId}).sort({createdAt: -1}).lean();

      if(!isMotorista)
        final = lista

      if(lista.length > 0)
      {
         final = await Promise.all(lista.map(async viagem => {
          var check = await ViagemDados.findOne({viagem: viagem._id});
          var val = {...viagem};
          if(check)
          {
            if(check.status == 2)
            {
              val.status = 3;
            }
          }
          return val;
        }))
      }
      res.status(200).json(final ?? []);
    } catch (e) {
      next(e);
    }
  };

  const getDecimalNumber = (val : number) => (val/100)

  export const CalcularValor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const data = req.body;

      const distancia = data.dist;
      const passageiros = data.passageiros
      
      var TOTAL = Number(ROTA_VALOR_INICIAL) + (Number(ROTA_VALOR_PASSAGEIRO) * passageiros) + (Number(ROTA_VALOR_KM) * distancia);
      
      res.status(200).json({message: getDecimalNumber(TOTAL).toFixed(2)});
    } catch (e) {
      next(e);
    }
  };

  export const AceitarViagem2 = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const { motorista } = req.body;

      const { id } = req.params;

      const userToken = retrieveBearerToken(req);
      
      if(!userToken)
      {
        res.status(401).json({
          message: 'Erro na sessão, tente novamente mais tarde.',
        });
        return;
      }
    
      const userId = userToken.userId;

      const vd = await ViagemDados.findOne({motorista: motorista})
      if(vd)
        await User.updateOne({_id: userId}, {$inc : {'saldo' : vd.valor / 100}})

      await ViagemDados.deleteMany({motorista: { "$ne": motorista }})

      await ViagemDados.updateOne({motorista: motorista}, {status: 1});

      await ViagemPedido.updateOne({_id: id}, {status: 2})

      const moto = await User.findById(motorista);
      if(moto)
      {
        await SendMail({
          to: moto.email,
          from: {
            name: 'Meu Fretado',
            email: 'meufretadopit@gmail.com'
          },
          subject: 'Um passageiro confirmou sua viagem!',
          text: 'Um passageiro confirmou sua viagem!',
          html: 'Um passageiro confirmou sua viagem!',
        })
      }
      
      res.status(200).json({});
    } catch (e) {
      next(e);
    }
  };