import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'https://localhost:4222'
});

stan.on('connect', async () => {
    console.log('publisher connected to nats');

    await new TicketCreatedPublisher(stan).publish({
        id: '1234',
        title: "test",
        price: 20
    });
});