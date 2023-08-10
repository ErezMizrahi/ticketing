import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
        title: 'testing',
        price: 20
    })
    .expect(404);
});

it('return 401 if the user in not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'testing',
        price: 20
    })
    .expect(401);
});

it('return 401 if the user does not own the ticket', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title: 'test',
        price: 30
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signin())
    .send({
        title: 'test_update',
        price: 32
    })
    .expect(401);
});

it('return 400 if the user provides an invalid title or price', async () => {
    const cookie = signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'test',
        price: 30
    });

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 30
    })
    .expect(400);

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'title',
        price: -10
    })
    .expect(400);

});

it('updates the ticket provided valid inputs', async () => {
    const cookie = signin();

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'test',
        price: 30
    });

    const newTitle = 'test2';
    const newPrice = 31;

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: newTitle,
        price: newPrice
    })
    .expect(200);


    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({});

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
});