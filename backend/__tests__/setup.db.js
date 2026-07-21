import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';

// Guarantee that these environment variables exist for CI
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_ci_pipeline';
process.env.NODE_ENV = 'test';

// Mock Cloudinary to avoid external API calls during tests
vi.mock('../config/cloudinary/cloudinary', () => ({
    uploader: {
        upload: vi.fn().mockResolvedValue({ secure_url: 'http://test-image-url.com/image.png' }),
        destroy: vi.fn().mockResolvedValue({ result: 'ok' })
    }
}));

// Mock Redis Client to avoid connection issues during tests
vi.mock('../redis/redisClient', () => ({
    connect: vi.fn().mockResolvedValue(),
    on: vi.fn(),
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    isOpen: false, // Default to closed so cache middleware skips
    delByPattern: vi.fn().mockResolvedValue()
}));


// Mock Socket.io to avoid errors when controllers emit events
vi.mock('../config/socket.config', () => ({
        getIo: vi.fn().mockReturnValue({
            emit: vi.fn(),
            to: vi.fn().mockReturnThis(),
            join: vi.fn(),
            leave: vi.fn()
        }),
        initSocket: vi.fn()
    }));

let mongoServer;

beforeAll(async () => {
    // Spin up an ephemeral, isolated MongoDB Replica Set in Node memory
    // Transactions require a Replica Set.
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const uri = mongoServer.getUri();

    // Prevent cross-contamination with live databases
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri);
}, 300000); // 5 minute timeout for initial download

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

afterEach(async () => {
    // Clear out documents after every single test iteration to ensure zero state leakage
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
