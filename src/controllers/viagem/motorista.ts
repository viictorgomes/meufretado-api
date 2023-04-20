import Boom from '@hapi/boom';
import { Request, Response, NextFunction } from 'express';

import { retrieveBearerToken } from '../../utils/jwt';
import { ROTA_VALOR_INICIAL, ROTA_VALOR_PASSAGEIRO, ROTA_VALOR_KM } from '../../utils/env';

import { User } from '../../models/user';
import { ViagemPedido } from '../../models/viagempedido';
import { Cidade } from '../../models/cidade';
import { Estado } from '../../models/estado';
import { ViagemDados } from '../../models/viagemdados';
import { SendMail } from '../../utils/sendmail';

export const ListarEstadoCidade = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const estado = await Estado.find().sort({nome: 1});
      const cidade = await Cidade.find().sort({nome: 1});

      const estados = estado.map(x => {
        return { _id: x.id, nome: x.nome }
      })

      const cidades = cidade.map(x => {
        return { _id: x.id, nome: x.nome, estado: x.estado }
      })
      
      res.status(200).json({estados, cidades});
    } catch (e) {
      next(e);
    }
  };

  const getDecimalNumber = (val : number) => (val/100)
  const setDecimalNumber = (val : number) => (val*100)

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

  interface Querys {
    sort_createdAt?: string;
    sort_passageiros?: number;
    estado?: any;
    cidade?: any;
  }

  const makeSort = ({
    sort_createdAt = '',
  }: Pick<Querys, 'sort_createdAt'>) => {
    const sortTypes = ['asc', 'desc'];
    const sort: Record<string, unknown> = {};
  
    if (sortTypes.includes(sort_createdAt)) sort.createdAt = sort_createdAt;
  
    return sort;
  };

  const makeFilter = ({
    estado,
    cidade,
  }: Pick<Querys, 'estado' | 'cidade'>) => {
    const filter: Record<string, unknown> = {};
  
    if (estado) filter.estado = { $in: [estado] };
    if (cidade) filter.cidade = { $in: [cidade] };

    filter.status = 1;
    
    return filter;
  };

  export const ListarSolicitacoes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        cidade,
        estado,
      }: Querys = req.query;

      const filter = makeFilter({cidade, estado });

      
      var pedidos = await ViagemPedido.find(filter)
      .populate({path: 'owner', select: ['_id', 'nome']})
      .populate('estadoa')
      .populate('cidadea')
      .populate('estadob')
      .populate('cidadeb')
      .sort(makeSort({sort_createdAt: 'desc'})).lean()

      var final = pedidos.map(x => {
        const distancia = x.distancia;
        const passageiros = x.passageiros
        
        var TOTAL = Number(ROTA_VALOR_INICIAL) + (Number(ROTA_VALOR_PASSAGEIRO) * passageiros) + (Number(ROTA_VALOR_KM) * (distancia / 1000));
        
        return {...x, valor: {parsed: getDecimalNumber(TOTAL).toFixed(2).replace('.',','), value: TOTAL}}
      });

      res.status(200).json(final);
    } catch (e) {
      next(e);
    }
  };

  export const ViagemInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const id = req.params['id'];

      var pedido = await ViagemPedido.findById(id)
      .populate('owner')
      .populate('estadoa')
      .populate('cidadea')
      .populate('estadob')
      .populate('cidadeb').lean()

      if(!pedido)
      {
        res.status(404);
        return;
      }

        const distancia = pedido.distancia;
        const passageiros = pedido.passageiros
        
        var TOTAL = Number(ROTA_VALOR_INICIAL) + (Number(ROTA_VALOR_PASSAGEIRO) * passageiros) + (Number(ROTA_VALOR_KM) * (distancia / 1000));
        

        var reqs = await ViagemDados.find({viagem: id}).populate('veiculo').populate('motorista').populate('motorista.concluidas').lean()

      res.status(200).json({...pedido, valor: {parsed: getDecimalNumber(TOTAL).toFixed(2).replace('.',','), value: TOTAL}, reqs});
    } catch (e) {
      next(e);
    }
  };

  export const AceitarViagem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { motorista, veiculo, valor } = req.body

      /*const userToken = retrieveBearerToken(req);
    
      if(!userToken)
      {
        res.status(401).json({
          message: 'Erro na sessão, tente novamente mais tarde.',
        });
        return;
      }*/

      const viagem = await ViagemPedido.findById(id);

      if(!viagem || viagem.status != 1)
      {
        res.status(201).json({message: 'Ops! Parece que essa viagem não existe mais'});
        return;
      }

      const check0 = await ViagemDados.findOne({motorista: motorista, viagem: id})

      if(check0)
      {
        res.status(201).json({message: 'Você já aceitou essa solicitação.'});
        return;
      }

      const dados = new ViagemDados({
        viagem: id,
        motorista,
        veiculo,
        passageiro: viagem.owner,
        valor: valor,
        status: 2
      })

      await dados.save();


      const passa = await User.findById(viagem.owner);
      if(passa)
      {
        await SendMail({
          to: passa.email,
          from: {
            name: 'Meu Fretado',
            email: 'meufretadopit@gmail.com'
          },
          subject: 'Encontramos um motorista para seu transporte!',
          text: 'Encontramos um motorista para seu transporte!',
          html: 'Encontramos um motorista para seu transporte!',
        })
      }

      res.status(200).json({message: 'Solicitação aceita, agora é necessário aguardar a confirmação e pagamento do passageiro para realizar a viagem.'});

    } catch (e) {
      next(e);
    }
  };

  export const MotoristaJaAceitouViagem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const userToken = retrieveBearerToken(req);
      
      if(!userToken)
      {
        res.status(401).json({
          message: 'Erro na sessão, tente novamente mais tarde.',
        });
        return;
      }
    
      const userId = userToken.userId;

      const [check0] = await ViagemDados.find({motorista: userId, viagem: id})

      res.status(200).json({aceito: check0 ? true : false, valor: check0 ? check0.valor : 0});
     
    } catch (e) {
      next(e);
    }
  };

  export const AttProgresso = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params

      const { progresso } = req.body

      const userToken = retrieveBearerToken(req);
      
      if(!userToken)
      {
        res.status(401).json({
          message: 'Erro na sessão, tente novamente mais tarde.',
        });
        return;
      }
    
      await ViagemDados.updateOne({_id: id, progresso})

      if(progresso == 3)
      {
        const vd = await ViagemDados.findById(id);
        if(!vd)
          return;

        await ViagemPedido.updateOne({_id: vd.viagem}, {status: 0})

        await User.updateOne({_id: vd.passageiro}, {$inc : {
          'saldo' : -(vd.valor / 100),
          'viagens': 1
        }})
        await User.updateOne({_id: vd.motorista}, {$inc : {
          'saldo' : (vd.valor / 100),
          'viagens': 1 
        }})
      }

      res.status(200).json();
     
    } catch (e) {
      next(e);
    }
  };
  
  export const CancelarViagem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params

      const userToken = retrieveBearerToken(req);
      
      if(!userToken)
      {
        res.status(401).json({
          message: 'Erro na sessão, tente novamente mais tarde.',
        });
        return;
      }
      
      const isMotorista = userToken.grupo == 'motorista'

      const viagem = await ViagemPedido.findById(id)

      if(!viagem)
        return

        if(isMotorista)
        {
          await ViagemDados.deleteMany({viagem: id, motorista: userToken.userId})
          await ViagemPedido.updateOne({_id: id}, {status: 1})
        }
        else
        {
          await ViagemDados.deleteMany({viagem: id})
          await ViagemPedido.updateOne({_id: id}, {status: -1})
        }
     

      res.status(200).json();
     
    } catch (e) {
      next(e);
    }
  };