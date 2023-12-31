import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY = 'sk_test_51Nok3dCnPH2CfTaz7PkPHmgWuv7qDlAQmHDCPnChBeSCkoEGn2sHddTy4AbDqVZ6oYxrixuz7dEhc2xgz9DzoDWR00uBeLnCYb';

beforeAll(async () => {
    process.env.JWT_KEY = 'test';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri);
});


beforeEach(async () => {
    jest.clearAllMocks();
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
    var signin: (id?: string) => string[];
}

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };
    const json = JSON.stringify(session);
    const base64 = Buffer.from(json).toString('base64');
    return [`session=${base64}`];
}