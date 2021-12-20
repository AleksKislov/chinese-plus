// redis db
const {createClient} = require("redis");
// const REDIS_PORT = 6379;
// const redisClient = redis.createClient(REDIS_PORT);

let client
(async () => {
  client = createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  const value = await client.get('好');
  console.log(value)
})();

module.exports = { redis:  client};
