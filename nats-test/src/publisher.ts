import nats from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'https://localhost:4222'
});

stan.on('connect', () => {
    console.log('publisher connected to nats');

    const data = JSON.stringify({
        id: '1234',
        title: "test",
        price: 20
    });

    stan.publish('ticket:created', data, () => {
        console.log('event published')
    })
});