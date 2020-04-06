# rabbit-mq-rpc

## Before using

Start RabbitMQ server

```
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Usage

Start receiver

```
npm run start:receiver
```

Send message to receiver

```
npm run send 10
```