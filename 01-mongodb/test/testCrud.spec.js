const {expect} = require('chai');
const axios = require('axios');
const service = require('../src/server');

describe('testCrud.spec.js', function () {
   before('start server', async () => {
      await testUtil.cleanCollection();
      await service();
   });

   it('should create object on POST and available on GET', async () => {
      const id = '44124441';
      await axios.post('http://localhost:8080/pets', {data: {name: 'Patron', id}});
      const gotPet = await axios.get(`http://localhost:8080/pets/${id}`);
      expect(gotPet).to.be.eql({name: 'Patron', id});
   });
});