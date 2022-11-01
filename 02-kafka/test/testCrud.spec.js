const {expect} = require('chai');
const axios = require('axios');
const service = require('../src/server');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
   clientId: 'node-app-test',
   brokers: ['kafka:9092']
});

describe('testCrud.spec.js', function () {
   before('start server and reset offset', async () => {
      const client = new MongoClient('mongodb://mongodb:27017');
      const db = client.db('mainDb');
      await db.collection('pets').drop().catch(() => {}); //ns can be not present
      await service();
   });

   it('should create object on POST and available on GET', async () => {
      const _id = '00000020f51bb4362eee2a4d';
      await axios.post('http://localhost:8080/pets', {name: 'Patron', _id});
      const { data } = await axios.get(`http://localhost:8080/pets/${_id}`);
      expect(data).to.be.eql({name: 'Patron', _id});
   });
});

async function getLastKafkaMessage({ consumer, topic, offset }) {
   await consumer.subscribe({ topic });
   return new Promise(resolve => {
      consumer.run({
         eachMessage: ({ message }) => {
            consumer.disconnect();
            resolve(message);
         },
      });
      consumer.seek({ topic, partition: 0, offset });
   });
}