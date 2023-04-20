import { Schema, model, Types, Document } from 'mongoose';

interface VeiculoDoc extends Document {
  tipo: 'van' | 'bus';
  modelo: string;
  placa: string;
  ano: string;
  passageiros: number;
  banheiro: boolean;
  poltrona: number;
  owner: Types.ObjectId;
  documento: Types.ObjectId;
  frente: Types.ObjectId;
  lateral: Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema(
  {
    tipo: String,
    modelo: String,
    placa: String,
    ano: String,
    passageiros: Number,
    banheiro: Boolean,
    poltrona: Number,
    owner: { type: Types.ObjectId, ref: 'User' },
    documento: { type: Types.ObjectId, ref: 'Files' },
    frente: { type: Types.ObjectId, ref: 'Files' },
    lateral: { type: Types.ObjectId, ref: 'Files' },
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

export const Veiculo = model<VeiculoDoc>('Veiculo', schema);
