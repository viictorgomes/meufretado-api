import { Schema, model, Types, Document, Decimal128 } from 'mongoose';

interface UserDoc extends Document {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  grupo: 'motorista' | 'passageiro';
  //ccs: any[];
  currentcc: any;
  saldo: number,
  perfil: Types.ObjectId;
  viagens: number;
  createdAt: Date;
}

function getDecimalNumber(val : number) {    return (val/100); }
function setDecimalNumber(val : number) {    return (val*100); }

const schema = new Schema(
  {
    nome: String,
    email: { type: String, unique: true },
    senha: {type: String},
    cpf: String,
    telefone: String,
    grupo: String,
    //ccs: [{type: Types.ObjectId, ref: 'CreditCard' }],
    currentcc: {type: Types.ObjectId, ref: 'CreditCard', default: null },
    saldo: { type: Number, default: 0, get: getDecimalNumber, set: setDecimalNumber },
    perfil: { type: Types.ObjectId, ref: 'Files', default: null },
    viagens: {type: Number, default: 0},
    createdAt: { type: Date, default: new Date().toISOString() },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual('concluidas', {
  ref: 'ViagemPedidos',
  localField: '_id',
  foreignField: 'owner',
  match:
  {
    status: 0
  },
  count: true
});

export const User = model<UserDoc>('User', schema);
