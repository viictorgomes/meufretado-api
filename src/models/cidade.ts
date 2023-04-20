import { Schema, model, Types, Document } from 'mongoose';

interface CidadeDoc extends Document {
  nome: string;
  estado: any;
}

const schema = new Schema(
  {
    nome: String,
    estado: { type: Types.ObjectId, ref: 'Estado' },
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

export const Cidade = model<CidadeDoc>('Cidade', schema);