import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order.model';
import { OrderStatus } from '@erezmiz-npm/tickets-common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment.model';

// jest.mock('../../stripe');

it('return a 404 when purchasing an order that does not exist', async () => {
    await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'asdasdadw',
        orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404);
    
});

it('return a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'asdasdadw',
        orderId: order.id
    }).expect(401);
});

it('return 400 when purchasing an order that is cancelled', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userCookie = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', userCookie)
    .send({
        token: 'asdasdadw',
        orderId: order.id
    }).expect(400);
});


it('return a 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const userCookie = signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });

    await order.save();    

    await request(app)
    .post('/api/payments')
    .set('Cookie', userCookie)
    .send({
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(order.price * 100);
    // expect(chargeOptions.currency).toEqual('usd');

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    })

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });

    expect(payment).not.toBeNull();
});