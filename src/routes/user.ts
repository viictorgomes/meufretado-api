import { Route } from '../types';
import { AddCC, RemoveCC, ListCC } from '../controllers/user/cc';
import { SaldoInfo, AttPerfil } from '../controllers/user/info';
import { AddVeiculo, RemoverVeiculo, ListarVeiculo } from '../controllers/user/veiculo';

import { checkAuth } from '../middlewares/withAuth';

import { upload } from '../utils/upload';

export const userRoute: Route[] = [
    {
        path: '/listcc',
        method: 'get',
        handlers: [checkAuth(), ListCC],
    },
    {
        path: '/saldo',
        method: 'get',
        handlers: [checkAuth(), SaldoInfo],
    },
    {
        path: '/addcc',
        method: 'post',
        handlers: [checkAuth(), AddCC],
    },
    {
        path: '/removecc',
        method: 'post',
        handlers: [checkAuth(), RemoveCC],
    },
    {
        path: '/addveiculo',
        method: 'post',
        handlers: [checkAuth(), upload.fields([{name: 'documentoFile', maxCount: 1}, {name: 'frenteFile', maxCount: 1}, {name: 'lateralFile', maxCount: 1}]), AddVeiculo],
    },
    {
        path: '/removerveiculo',
        method: 'post',
        handlers: [checkAuth(), RemoverVeiculo],
    },
    {
        path: '/listveiculo',
        method: 'get',
        handlers: [checkAuth(), ListarVeiculo],
    },
    {
        path: '/atualizarperfil',
        method: 'post',
        handlers: [checkAuth(), upload.single('perfilFile'), AttPerfil],
    },
]