import { Request, Response } from 'express';
import { service } from '../services/order.service';

export const getOrders = async (req: Request, res: Response) => {
    const orders = await service.getAllOrders(req.currentUser!.id);
    res.status(200).send(orders);
}

export const patchOrder = async (req: Request, res: Response) => {
    const order = await service.changeOrderToCancel(req.params.orderId, req.currentUser!.id);
    res.status(204).send(order);
}

export const getOrder = async (req: Request, res: Response) => {
    const order = await service.getOrder(req.params.orderId, req.currentUser!.id);
    res.status(200).send(order);
}

export const createOrder = async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const order = await service.createAnOrder(ticketId, req.currentUser!.id);
    
    res.status(201).send(order);
}