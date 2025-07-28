const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false // For Upstash Redis on Render
  }
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

async function connectRedis() {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('✅ Redis Connected Successfully!');
    }
  } catch (err) {
    console.error('❌ Redis Connection Failed:', err);
  }
}

module.exports = { client, connectRedis };
