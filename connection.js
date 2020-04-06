const amqp = require('amqplib');

const RABBIT_MQ_URL = 'amqp://localhost';

module.exports.generateUuid = () => Math.random().toString() + Math.random().toString() + Math.random().toString();

module.exports.RPC_QUEUE_NAME = 'rpc_queue';

module.exports.connection = async () => {
    try {
        const connection = await amqp.connect(RABBIT_MQ_URL);
        const channel = await connection.createChannel();
        return {connection, channel};
    } catch (e) {
        console.log(e);
        process.exit(e.code);
    }
    
}

