import request from 'supertest';
import { app } from '../../app';

it('return 201 on successfull signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@gmail.com",
            password: "password"
        })
        .expect(201);
});

it('returns 400 with an invalid email' , async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "dgmail.com",
        password: "password"
    })
    .expect(400);
});

it('returns 400 with an invalid password' , async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: "test@gmail.com",
        password: "1"
    })
    .expect(400);
});

it('returns 400 with missing email and password' , async () => {
    await request(app)
    .post('/api/users/signup')
    .send({email: 'test@gmail.com'})
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({password: '1234'})
    .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({email: 'test@gmail.com', password: '1234'})
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({email: 'test@gmail.com', password: '1234'})
    .expect(400);
});

it('sets a cookie after a successfull signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({email: 'test@gmail.com', password: '1234'})
        .expect(201);
    
        expect(response.get('Set-Cookie')).toBeDefined();
    });