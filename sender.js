#!/usr/bin/env node

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log("Usage: sender.js 10");
  process.exit(1);
}

const rmq = require('./connection');


async function main () {
  const { connection, channel } = await rmq.connection();

  const queue = await channel.assertQueue('', { exclusive: true });
  const correlationId = rmq.generateUuid();
  const [num] = args;
  let counter = 1;
  let isRunning = true;
  while (isRunning) {
    counter++;
    console.log('Send number: ', counter);
    channel.sendToQueue(
      rmq.RPC_QUEUE_NAME,
      Buffer.from(counter.toString()),
      { 
        correlationId, 
        replyTo: queue.queue
      }
    );
    isRunning = num > counter;
  }

  channel.consume(
    queue.queue,
    msg => {
      const response = JSON.parse(msg.content);
      console.log(response);
      if (msg.properties.correlationId == correlationId & num > response.number) {
        console.log(' [.] Got %s', response.fib);
      } else {
        process.exit(0);
      }
    },
    {noAck: true}
  );

}
main();
