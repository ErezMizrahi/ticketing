import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket.model";
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler lisiting to /api/tickets for post requests', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({});

    expect(response.status)
    .not
    .toEqual(404);
});

it('can only be accessed if the user i signed in', async () => {
    await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401);

});

it('return status other than 401 if the user is signed in', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});

    expect(response.status)
    .not
    .toEqual(401);

});

it('returns an error if an invalid title is provided', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title: '',
        price: 10
    });

    expect(response.status)
    .toEqual(400);

    const response2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        price: 10
    });

    expect(response2.status)
    .toEqual(400);
});

it('return an error if an invalid price is provided', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title: 'test',
        price: -10
    });

    expect(response.status)
    .toEqual(400);

    const response2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title: 'test',
    });

    expect(response2.status)
    .toEqual(400);
});

it('creates a tickets with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length)
    .toEqual(0);

    const title = 'test';
    const price = 20;

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title,
        price
    });

    expect(response.status)
    .toEqual(201);

    tickets = await Ticket.find({});
    expect(tickets.length)
    .toEqual(1);
    expect(tickets[0].title).toEqual(title)
    expect(tickets[0].price).toEqual(price)
});

it('publishes and event', async () => {
    const title = 'test';
    const price = 20;

    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({
        title,
        price
    });

    expect(response.status)
    .toEqual(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});