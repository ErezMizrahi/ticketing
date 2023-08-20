import { Request, Response } from 'express';
import { service } from '../services/order.service';

export const getOrders = async (req: Request, res: Response) => {
    
    res.status(200).send({});
}

export const deleteOrder = async (req: Request, res: Response) => {

    res.status(200).send({});
}

export const getOrder = async (req: Request, res: Response) => {
    
    res.status(200).send({});
}

export const createOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const order = await service.createAnOrder(ticketId, req.currentUser!.id);
    
    res.status(201).send(order);
}