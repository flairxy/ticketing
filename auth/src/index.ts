import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  try {
    console.log('starting up...');
    if (!process.env.JWT_KEY) {
      // this is the JWT created in k8s using the
      //"kubectl create secret generic jwt-secret --from-literal=JWT_KEY=[value]"
      throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(3000, () => {
      console.error('listening on port 3000');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
