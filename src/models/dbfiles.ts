import { Schema, model, Types, Document } from 'mongoose';

interface FilesDoc extends Document {
  owner: Types.ObjectId;
  contentType: string;
  hash: string;
  data: Buffer;
}

const schema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'User' },
    contentType: String,
    data: Buffer,
    hash: String,
    createdAt: { type: Date, default: new Date().toISOString() },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const DBFiles = model<FilesDoc>('Files', schema);