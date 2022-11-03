const {expect} = require('chai');
const axios = require('axios');
const service = require('../src/server');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
   clientId: 'node-app-test',
   brokers: ['kafka:9092']
});
const topic = 'zoo';

describe('testCrud.spec.js', function () {
   let consumer, admin;

   before('start server and reset offset', async () => {
      consumer = kafka.consumer({ groupId: 'test-group-1' });
      admin = kafka.admin();
      await admin.connect();
      await ensureTopic(admin, topic);
      await service();
   });

   it('should create object on POST and available on CONSUME', async () => {
      const offset = await getCurrentOffset(admin, topic);
      const _id = '00000020f51bb4362eee2a4d';
      await axios.post('http://localhost:8080/pets', {name: 'Patron', _id});
      const message = await getLastKafkaMessage({ consumer, topic, offset });
      const data = JSON.parse(message.value.toString());
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

async function ensureTopic(admin, topic) {
   await admin.createTopics({
      waitForLeaders: true,
      topics: [
         {
            topic,
            configEntries: [
               { name: 'max.message.bytes', value: "8000000" }
            ]
         },
      ],
   });
}

async function getCurrentOffset(admin, topic) {
   const offsets = await admin.fetchTopicOffsets(topic);
   return offsets[0].high;
}