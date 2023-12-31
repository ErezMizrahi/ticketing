import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract readonly subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(message: T['data'], msg: Message): void; 
    
    constructor(private client: Stan, protected ackWait: number = 5 * 1000) {}

    private subscriptionOptions() {
        return this.client.subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true).setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`message recived ${msg.getSubject()} / ${this.queueGroupName}`);
            const parsedMessage = this.parseMessage(msg);
            this.onMessage(parsedMessage, msg);
        });

    }

    private parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
    }
}
