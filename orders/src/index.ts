import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket.created';
import { TicketUpdatedListener } from './events/listeners/ticket.updated';
import { ExpirationCompleteLisenter } from './events/listeners/expiration.completed';

const start = async () => {
    try {
        if(!process.env.JWT_KEY) throw new Error('JWT_KEY must be defiend');
        if(!process.env.MOMGO_URI) throw new Error('MOMGO_URI must be defiend');

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

        await mongoose.connect(process.env.MOMGO_URI);
        console.log('connected to mongodb');

        app.listen(3000, () => {
            console.log('listening on port 3000');

            new TicketCreatedListener(natsWrapper.client).listen();
            new TicketUpdatedListener(natsWrapper.client).listen();
            new ExpirationCompleteLisenter(natsWrapper.client).listen();
        });
    } catch (e) {
        console.error(e)
    }
}


start();