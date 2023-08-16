import { Request, Response } from "express"
import { TicketService } from "../services/tickets.service";

export const newTicket = async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const service = new TicketService();
    const ticket = await service.createTicket({
        title,
        price,
        userId: req.currentUser!.id
    });

    res.status(201).json(ticket);
}

export const getTicket = async (req: Request, res: Response) => {
    const service = new TicketService();
    const ticket = await service.getTicket(req.params.id);
    res.status(200).json(ticket);
}

export const getTickets = async (req: Request, res: Response) => {
    const service = new TicketService();
    const tickets = await service.getTickets();
    res.status(200).json(tickets);
}

export const updateTicket = async (req: Request, res: Response) => {
    const service = new TicketService();
    const updateObject = {
        id: req.params.id,
        currentUserId: req.currentUser!.id,
        title: req.body.title,
        price: req.body.price
    }
    const ticket = await service.updateTicketById(updateObject)

    res.send(ticket)
}