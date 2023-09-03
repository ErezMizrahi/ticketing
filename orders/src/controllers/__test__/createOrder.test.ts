import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order.model';
import { Ticket } from '../../models/ticket.model';
import { natsWrapper } from '../../nats-wrapper';

it('can only be accessed if the user is signed in', async () => {
    await request(app)
    .post('/api/orders')
    .send({})
    .expect(401);

});

it('return status other than 401 if the user is signed in', async () => {
    const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({});

    expect(response.status)
    .not
    .toEqual(401);

});

it('returns an error if an invalid ticketId is provided', async () => {
    const response = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
        ticketId: ''
    });

    expect(response.status)
    .toEqual(400);

    const response2 = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
        ticketId: '12323fd4'
    });

    expect(response2.status)
    .toEqual(400);
});


it('return an error if the ticket does not exists', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId })
    .expect(404);

})

it('return an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: '2323',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });

    await order.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id})
    .expect(400)
})

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id})
    .expect(201)
})


it('emits order created event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id})
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
