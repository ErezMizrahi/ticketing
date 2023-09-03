import reuqest from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { request } from 'express';
import mongoose from 'mongoose';

it('fetches the order', async () => {
    const user = signin();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        title: 'concert',
        price: 20
    });

    ticket.save();

    const { body: order } = await reuqest(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

    const { body: fetchedOrder } = await reuqest(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user is trying to fetch another user order', async () => {
    const user = signin();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        title: 'concert',
        price: 20
    });

    ticket.save();

    const { body: order } = await reuqest(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

    await reuqest(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', signin())
    .expect(401);

});


