import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('listener connected to nats');

    const subscription = stan.subscribe('ticket:created');
    subscription.on('message', (msg: Message) => {
        console.log('message recived');
        const data = msg.getData();

        if (typeof data === 'string') {
            console.log(`Recived event number #${msg.getSequence()} with data ${data}`);
        }
    });
});