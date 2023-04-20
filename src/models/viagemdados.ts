import { Schema, model, Types, Document } from 'mongoose';

interface ViagemDadosDoc extends Document {
  viagem: Types.ObjectId;
  veiculo: Types.ObjectId;
  passageiro: Types.ObjectId;
  motorista: Types.ObjectId;
  status: number;
  valor: number;
  progresso: number;
}

const schema = new Schema(
  {
    viagem: { type: Types.ObjectId, ref: 'ViagemPedido' },
    veiculo: { type: Types.ObjectId, ref: 'Veiculo' },
    passageiro: { type: Types.ObjectId, ref: 'User' },
    motorista: { type: Types.ObjectId, ref: 'User' },
    status: Number,
    valor: Number,
    progresso: {type: Number, default: 0},
    createdAt: { type: Date, default: new Date().toISOString() },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*schema.virtual('owner', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  count: true,
});*/

export const ViagemDados = model<ViagemDadosDoc>('ViagemDados', schema);