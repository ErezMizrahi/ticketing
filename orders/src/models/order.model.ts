import { Document, Model, Schema, model } from "mongoose"
import { OrderStatus } from "@erezmiz-npm/tickets-common";
import { TicketDoc } from "./ticket.model";

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: Schema.Types.Date
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id; 
        }
    }
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order =  model<OrderDoc, OrderModel>('order', orderSchema);
export { Order, OrderStatus }