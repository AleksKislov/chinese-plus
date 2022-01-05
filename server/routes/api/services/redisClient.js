const {createClient} = require("redis");

const redis = createClient();
(async () => {
  redis.on('error', (err) => console.log('Redis Client Error', err));
  await redis.connect();
  console.log('Redis connected');
})();

module.exports = { redis };
