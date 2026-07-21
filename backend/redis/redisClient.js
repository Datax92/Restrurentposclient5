const { createClient } = require('redis');

const clientOptions = {
    socket: {
        connectTimeout: 10000, // 10 seconds timeout
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.error('❌ Redis: Max retries exhausted. Stopping reconnection attempts.');
                return new Error('Redis Max Retries Exhausted');
            }
            return Math.min(retries * 100, 3000); // Backoff strategy
        }
    }
};

if (process.env.REDIS_URL) {
    clientOptions.url = process.env.REDIS_URL;
} else {
    clientOptions.username = process.env.REDIS_USERNAME;
    clientOptions.password = process.env.REDIS_PASSWORD;
    clientOptions.socket.host = process.env.REDIS_HOST;
    clientOptions.socket.port = process.env.REDIS_PORT;
}

const redisClient = createClient(clientOptions);

redisClient.on('error', err => console.log('❌ Redis Client Error', err));

redisClient.on('connect', () => console.log('⌚ Redis Client Connecting...'));

redisClient.on('ready', () => console.log('✅ Redis Client Ready'));

(async () => {
    if (process.env.NODE_ENV === 'test') {
        redisClient.isOpen = false;
        return;
    }
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('❌ Redis Connection Failed', err);
    }
})();

/**
 * Delete keys matching a pattern
 * @param {string} pattern - Redis key pattern (e.g., 'cache:/api/menu*')
 */
redisClient.delByPattern = async (pattern) => {
    if (!redisClient.isOpen) return;

    try {
        let cursor = '0'; // Start with string '0'
        do {
            const reply = await redisClient.scan(cursor, {
                MATCH: pattern,
                COUNT: 100
            });
            cursor = String(reply.cursor); // Convert to string
            const keys = reply.keys;

            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } while (cursor !== '0'); // Compare with string '0'
    } catch (err) {
        console.error(`❌ Redis delByPattern Error (${pattern}):`, err);
    }
};

module.exports = redisClient;