import { Schema, model, Types, Document } from 'mongoose';

interface EstadoDoc extends Document {
  nome: string;
}

const schema = new Schema(
  {
    nome: String,
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

export const Estado = model<EstadoDoc>('Estado', schema);