import mongoose from 'mongoose';
import { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } from '../utils/env';

const isProduction = process.env.NODE_ENV === 'production';
//const isProduction = true;

//var uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
//var uri = 'mongodb+srv://victor:7895123@cluster0.n5wjw.mongodb.net/app';

var uri = `mongodb://${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

//if(!isProduction)
//  uri = `mongodb://${DB_HOST}/${DB_NAME}`;

export const connectDb = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoIndex: isProduction ? false : true,
      useFindAndModify: false,
    });

    console.info('Success connection db');
  } catch (e) {
    console.error('Error conenction db:', e);
  }
};
