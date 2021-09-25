import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

let id: string;
let title: string;
let price: number;

beforeEach(() => {
  id = new mongoose.Types.ObjectId().toHexString();
  title = 'Title';
  price = 20;
});

it('returns 404 id provided id does not exist', async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'Title Updated', price: 25 })
    .expect(401);
});

it('returns 400 if user provides an invalid price or title', async () => {
  let cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 25 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'Valid title', price: -5 })
    .expect(400);
});

it('updates ticket with provided valid inputs', async () => {
  let cookie = global.signin();
  const title2 = 'Valid title';
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price });

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: title2, price: 25 });

  expect(ticketResponse.body.title).toEqual(title2);
  expect(ticketResponse.body.price).toEqual(25);
});
