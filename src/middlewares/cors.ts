import cors, { CorsOptions } from 'cors';

const options: CorsOptions = {
  origin: (origin, cb) => {
    cb(null, true);
  },
};

const corsOrigin = () => cors(options);

export default corsOrigin;
