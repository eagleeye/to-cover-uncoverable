const express = require('express');
const app = express()
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://mongodb:27017');
let db, collection;

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/pets/:id', asyncHandler(async (req, res) => {
    const pet = await collection.findOne({_id: req.params.id});
    res.json(pet);
}));

app.post('/pets', express.json(), asyncHandler(async (req, res) => {
    await collection.insertOne(req.body);
    res.sendStatus(201);
}));

app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

const serviceStart = async function() {
    await client.connect();
    await listen(8080);
    db = client.db('mainDb');
    collection = db.collection('pets');
}

function listen(port) {
    return new Promise((resolve, reject) => {
        app.listen(port)
            .once('listening', resolve)
            .once('error', reject);
    });
}

module.exports = serviceStart;