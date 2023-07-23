import request from 'supertest';
import { app } from '../../app';

it('return 200 on successfull signin with a cookie', async () => {
    await signup();

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns 400 with an invalid email' , async () => {
    return request(app)
    .post('/api/users/signin')
    .send({
        email: "dgmail.com",
        password: "password"
    })
    .expect(400);
});

it('returns 400 with an invalid password' , async () => {
    return request(app)
    .post('/api/users/signin')
    .send({
        email: "test@gmail.com",
        password: "1"
    })
    .expect(400);
});


it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "dosentExist@gmail.com",
            password: "1"
        })
        .expect(400);
});

it('fails when a an incorrect password is supplied', async () => {
    await signup();

    return request(app)
        .post('/api/users/signin')
        .send({
            email: "test@gmail.com",
            password: "incorrect"
        })
        .expect(400);
});