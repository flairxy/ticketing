import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

//this hook clears the db before each test is run
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//disconnect when all tests are finished
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // since we don't want our app to reach into the auth service just to
  // generate a user credential, we're going to try to build one

  //build a JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'user@mail.com',
  };
  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object: {jwt: MY_JWT}
  const session = { jwt: token };

  // turn the session into JSON
  const sessionJson = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64');

  return [`express:sess=${base64}`];
};
