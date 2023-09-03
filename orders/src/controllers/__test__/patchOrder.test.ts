import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket.model';
import { Order, OrderStatus } from '../../models/order.model';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const user = signin();
    const ticket = await Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 }).save();
    
    const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

    await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(204);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('emits a order cancelled event', async () => {
    const user = signin();
    const ticket = await Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 }).save();
    
    const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

    await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});