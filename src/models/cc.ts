import { Schema, model, Types, Document } from 'mongoose';

interface CreditCardDoc extends Document {
  nome: string;
  numero: string;
  mes: string;
  ano: string;
  ccv: string;
  brand: string;
  owner: Types.ObjectId,
  createdAt: Date;
}

const schema = new Schema(
  {
    nome: String,
    numero: String,
    mes: String,
    ano: String,
    ccv: String,
    brand: String,
    owner: { type: Types.ObjectId, ref: 'User' },
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

export const CreditCard = model<CreditCardDoc>('CreditCard', schema);
