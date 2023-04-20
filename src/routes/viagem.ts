import { Route } from '../types';
import { CriarViagem, ListarViagens, CalcularValor, AceitarViagem2 } from '../controllers/viagem/passageiro';
import { ListarEstadoCidade, ListarSolicitacoes, ViagemInfo, AceitarViagem, MotoristaJaAceitouViagem, AttProgresso, CancelarViagem } from '../controllers/viagem/motorista';

import { checkAuth } from '../middlewares/withAuth';

export const viagem: Route[] = [
    {
        path: '/criar',
        method: 'post',
        handlers: [checkAuth(), CriarViagem],
    },
    {
        path: '/listarp',
        method: 'get',
        handlers: [checkAuth(), ListarViagens],
    },
    {
        path: '/calcular',
        method: 'post',
        handlers: [CalcularValor],
    },
    {
        path: '/estadoecidade',
        method: 'get',
        handlers: [ListarEstadoCidade],
    },
    {
        path: '/listarsolicitacoes',
        method: 'get',
        handlers: [ListarSolicitacoes],
    },
    {
        path: '/:id',
        method: 'get',
        handlers: [ViagemInfo],
    },
    {
        path: '/aceitar/:id',
        method: 'post',
        handlers: [AceitarViagem],
    },
    {
        path: '/aceitar2/:id',
        method: 'post',
        handlers: [ AceitarViagem2 ]
    },
    {
        path: '/motocheck/:id',
        method: 'post',
        handlers: [ MotoristaJaAceitouViagem ]
    },
    {
        path: '/progresso/:id',
        method: 'post',
        handlers: [ AttProgresso ]
    },
    {
        path: '/cancelar/:id',
        method: 'post',
        handlers: [ CancelarViagem ]
    }
    
]