#!/usr/bin/env node

const rmq = require('./connection');

function fibonacci(n) {
  if (n == 0 || n == 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}

async function main() {
  const { channel } = await rmq.connection();

  const queue = await channel.assertQueue(rmq.RPC_QUEUE_NAME, { durable: false });
  await channel.prefetch(1);
  console.log(' [x] Awaiting RPC requests');

  channel.consume(
    rmq.RPC_QUEUE_NAME,
    msg => {
      const n = parseInt(msg.content.toString());
      console.log(" [.] fib(%d)", n);

      const r = fibonacci(n);
      setTimeout(() => {
        const res = JSON.stringify({number: n, fib: r});
        console.log('Send back: ', n);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(res),
          {
            correlationId: msg.properties.correlationId
          }
        );
  
        channel.ack(msg);

      }, 3000);
      
    }
  );
}

main();
