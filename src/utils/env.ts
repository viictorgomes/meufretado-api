import dotenv from 'dotenv-flow';

dotenv.config();

export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const SECRET_JWT = process.env.SECRET_JWT;

export const ROTA_VALOR_INICIAL = process.env.ROTA_VALOR_INICIAL;
export const ROTA_VALOR_PASSAGEIRO = process.env.ROTA_VALOR_PASSAGEIRO;
export const ROTA_VALOR_KM = process.env.ROTA_VALOR_KM;