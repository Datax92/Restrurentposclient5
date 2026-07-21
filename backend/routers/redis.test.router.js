const express = require('express');
const router = express.Router();
const redisClient = require('../redis/redisClient');

router.get('/test-redis', async (req, res) => {
    try {
        const isOpen = redisClient.isOpen;
        const isReady = redisClient.isReady;

        let pingResult = null;
        if (isOpen) {
            pingResult = await redisClient.ping();
        }

        res.json({
            success: true,
            status: {
                isOpen,
                isReady,
                ping: pingResult
            },
            config: {
                host: process.env.REDIS_HOST ? 'Set (Hidden)' : 'Not Set',
                port: process.env.REDIS_PORT || 'Not Set'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Redis Test Failed",
            error: error.message
        });
    }
});

module.exports = router;
