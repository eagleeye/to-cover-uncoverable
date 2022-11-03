process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;
const express = require('express');
const app = express()
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'node-app',
    brokers: ['kafka:9092']
});
const producer = kafka.producer();

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.post('/pets', express.json(), asyncHandler(async (req, res) => {
    await producer.send({
        topic: 'zoo',
        messages: [{ value: JSON.stringify(req.body)}],
    })
    res.sendStatus(201);
}));

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

const serviceStart = async function() {
    await producer.connect();
    await listen(8080);
}

function listen(port) {
    return new Promise((resolve, reject) => {
        app.listen(port)
            .once('listening', resolve)
            .once('error', reject);
    });
}

module.exports = serviceStart;