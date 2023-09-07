import { OrderCreatedListener } from './events/listeners/order.created.listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    try {
        if(!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defiend');
        if(!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defiend');
        if(!process.env.NATS_URL) throw new Error('NATS_URL must be defiend');

        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('listener connection close');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();
        
    } catch (e) {
        console.error(e)
    }
}


start();