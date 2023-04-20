import { Schema, model, Types, Document } from 'mongoose';

interface ViagemPedidoDoc extends Document {
  passageiros: number;
  de: string;
  para: string;
  estadoa: any;
  estadob: any;
  cidadea: any;
  cidadeb: any;
  data: Date;
  status: number;
  owner: string;
  coords: string;
  tempo: string,
  distancia: number,
  carro: number,
  createdAt: Date;
}

const schema = new Schema(
  {
    passageiros: Number,
    de: String,
    para: String,
    estadoa: { type: Types.ObjectId, ref: 'Estado' },
    estadob: { type: Types.ObjectId, ref: 'Estado' },
    cidadea: { type: Types.ObjectId, ref: 'Cidade' },
    cidadeb: { type: Types.ObjectId, ref: 'Cidade' },
    data: Date,
    status: { type: Number, default: 1 },
    coords: String,
    tempo: String,
    distancia: Number,
    carro: Number,
    owner: { type: Types.ObjectId, ref: 'User' },
    //viagemDados: { type: Types.ObjectId, ref: 'ViagemDados' },
    createdAt: { type: Date, default: new Date().toISOString() },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*schema.virtual('_owner', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
});

schema.virtual('_estadoa', {
  ref: 'Estado',
  localField: 'estadoa',
  foreignField: '_id',
});

schema.virtual('_cidadea', {
  ref: 'Cidade',
  localField: 'cidadea',
  foreignField: '_id',
});*/

export const ViagemPedido = model<ViagemPedidoDoc>('ViagemPedido', schema);