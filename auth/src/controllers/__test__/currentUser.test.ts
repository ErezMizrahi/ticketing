import request from 'supertest';
import { app } from '../../app';

it('response with details about the current logged in user', async () => {
    const cookie = await signup();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(400);

    expect(response.body.currentUser.email).toEqual('test@gmail.com');
});

it('responses with null if not authoticated', async () => {
    const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

    expect(response.body.currentUser).toEqual(null);

});