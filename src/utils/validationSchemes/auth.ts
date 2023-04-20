import Joi from 'joi';

export const schemeSignup = Joi.object({
  nome: Joi.string().required(),
  senha: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  grupo: Joi.string().required(),
  cpf: Joi.string().required(),
  telefone: Joi.string().required()
});
