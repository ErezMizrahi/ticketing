import { Ticket } from "../ticket.model";

it('implements Optimistic Concurrency Control', async () => {
    const ticket = await Ticket.build({ title: 'concert', price: 5, userId: '123' }).save();

    const firstInstance = await Ticket.findById(ticket.id);
    const seconedInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    seconedInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
        await seconedInstance!.save();
    } catch (e) {
        return;
    }

    throw new Error('should not have reach this point');

});


it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({ title: 'concert', price: 20, userId:'123' })

    await ticket.save();
    expect(ticket.version).toEqual(0)
    await ticket.save();    
    expect(ticket.version).toEqual(1)
    await ticket.save();    
    expect(ticket.version).toEqual(2)

});