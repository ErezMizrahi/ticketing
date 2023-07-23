import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'test';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri);
});


beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for(const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    
    await mongoose.connection.close();
});

declare global {
    var signup: () => Promise<string[]>;
}

global.signup = async () => {
    const body = {
        email :'test@gmail.com',
        password: 'password'
    }

    const response = await request(app)
        .post('/api/users/signup')
        .send(body)
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
    const cookie = response.get('Set-Cookie');
    return cookie;
}